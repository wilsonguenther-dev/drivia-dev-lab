/**
 * Drivia Dev Lab v1 — client runtime.
 *
 * Sections:
 *   1. AudioBus + Kokori TTS + persistent IDB blob cache
 *   2. SpeakBack elocution
 *   3. StudyTimer (count-up, lifetime, cross-tab synced)
 *   4. Mastery toggle per term + streak
 *   5. Flashcard quiz overlay
 *   6. Event wiring + keyboard shortcuts
 */
import confettiFn from "canvas-confetti";
import { kvGet, kvSet, blobGet, blobSet, onBus, emitBus } from "../lib/cache";
import { getStreak, bumpStreak } from "../lib/mastery";
import { TERMS } from "../data/terms";
import { scoreSpeakBack, speakDiffMarkup } from "../lib/speakmatch";
import { fetchTTSBlob, webSpeechSpeak, getTTSConfig, type SpeechHandle } from "../lib/tts";

declare global { interface Window { confetti?: typeof confettiFn } }
if (typeof window !== "undefined" && !window.confetti) window.confetti = confettiFn;

// ──────────────────────────────────────────────────────────────────────
// 1. AUDIO PIPELINE — pluggable TTS via lib/tts
// ──────────────────────────────────────────────────────────────────────
const memCache: Record<string, string> = {};

async function hashKey(text: string): Promise<string> {
  const cfg = getTTSConfig();
  const enc = new TextEncoder().encode(`${cfg.backend}|${cfg.voice}|${text}`);
  try {
    const buf = await crypto.subtle.digest("SHA-1", enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    let h = 0x811c9dc5;
    for (let i = 0; i < enc.length; i++) { h ^= enc[i]; h = (h * 0x01000193) >>> 0; }
    return `fnv${h.toString(16)}`;
  }
}

let __webSpeechCurrent: SpeechHandle | null = null;

interface BusSource { audio: HTMLAudioElement; onStop: (() => void) | null; tag: string }
const AudioBus = {
  current: null as BusSource | null,
  paused: false,
  stop(): void {
    if (__webSpeechCurrent) {
      try { __webSpeechCurrent.stop(); } catch {}
      __webSpeechCurrent = null;
    }
    const c = this.current;
    if (!c) return;
    this.current = null; this.paused = false;
    try { c.audio.pause(); } catch {}
    c.audio.onended = null; c.audio.onerror = null;
    if (c.audio.src.startsWith("blob:")) { try { URL.revokeObjectURL(c.audio.src); } catch {} }
    c.audio.src = "";
    try { c.onStop?.(); } catch {}
    this.refreshBadge();
  },
  togglePause(): void {
    const c = this.current; if (!c) return;
    if (this.paused) { c.audio.play().catch(() => {}); this.paused = false; }
    else { c.audio.pause(); this.paused = true; }
    this.refreshBadge();
  },
  play(url: string, opts?: { onStop?: () => void; tag?: string }): Promise<void> {
    this.stop();
    return new Promise((resolve) => {
      const audio = new Audio(url);
      const src: BusSource = { audio, onStop: () => { try { opts?.onStop?.(); } catch {} resolve(); }, tag: opts?.tag || "" };
      this.current = src; this.paused = false;
      const cleanup = () => {
        if (this.current?.audio === audio) { this.current = null; this.paused = false; this.refreshBadge(); }
        resolve();
      };
      audio.onended = cleanup; audio.onerror = cleanup;
      this.refreshBadge();
      audio.play().catch(cleanup);
    });
  },
  refreshBadge(): void {
    const badge = document.getElementById("g-audio-stop");
    if (!badge) return;
    if (this.current) {
      badge.style.display = "";
      badge.textContent = this.paused ? "▶ Resume audio" : "■ Stop audio";
    } else badge.style.display = "none";
  },
};
(globalThis as any).__audio = AudioBus;

async function tryFetchLiveTTS(text: string): Promise<string | null> {
  const controller = new AbortController();
  const tHandle = setTimeout(() => controller.abort(), 12000);
  try {
    const blob = await fetchTTSBlob(text, controller.signal);
    clearTimeout(tHandle);
    if (!blob) return null;
    void hashKey(text).then((k) => blobSet(k, blob));
    return URL.createObjectURL(blob);
  } catch (e) {
    clearTimeout(tHandle);
    console.warn("TTS backend unavailable:", e);
    return null;
  }
}

async function fetchAudio(cacheKey: string, text: string): Promise<string | null> {
  if (memCache[cacheKey]) return memCache[cacheKey];
  const k = await hashKey(text);
  const cached = await blobGet(k);
  if (cached) { const u = URL.createObjectURL(cached); memCache[cacheKey] = u; return u; }
  const live = await tryFetchLiveTTS(text);
  if (live) memCache[cacheKey] = live;
  return live;
}

/**
 * Unified speak helper. WebSpeech → SpeechSynthesis directly. URL backends
 * → fetch blob and route through AudioBus.
 */
async function speakViaConfig(
  cacheKey: string,
  text: string,
  opts: { tag: string; onStop?: () => void } = { tag: "" },
  onUnavailable?: () => void,
): Promise<void> {
  const cfg = getTTSConfig();
  if (cfg.backend === "webspeech") {
    AudioBus.stop();
    __webSpeechCurrent = webSpeechSpeak(text, cfg);
    try {
      await __webSpeechCurrent.ended;
    } finally {
      __webSpeechCurrent = null;
      try { opts.onStop?.(); } catch {}
    }
    return;
  }
  const url = await fetchAudio(cacheKey, text);
  if (!url) { onUnavailable?.(); return; }
  await AudioBus.play(url, opts);
}

function setStatus(idx: number, t: string): void {
  const el = document.getElementById(`st-${idx}`);
  if (el) el.textContent = t;
}

async function hearTerm(idx: number): Promise<void> {
  const term = TERMS[idx];
  if (!term) return;
  setStatus(idx, "loading…");
  const text = `${term.title}. ${term.plain}`;
  setStatus(idx, "▶ playing");
  await speakViaConfig(
    `term-${idx}`,
    text,
    { tag: `term-${idx}`, onStop: () => setStatus(idx, "stopped") },
    () => setStatus(idx, `${getTTSConfig().backend} unavailable — open Settings`),
  );
  setStatus(idx, "ready");
}

// ──────────────────────────────────────────────────────────────────────
// 2. MASTERY (toggle per-term)
// ──────────────────────────────────────────────────────────────────────
type MasteryMap = Record<string, boolean>;
const MASTERY_KEY = "termMastery";
function loadMastery(): MasteryMap { return kvGet<MasteryMap>(MASTERY_KEY, {}); }
function saveMastery(m: MasteryMap): void { kvSet(MASTERY_KEY, m); }

function applyMasteryToUI(): void {
  const m = loadMastery();
  let mastered = 0;
  TERMS.forEach((t, i) => {
    const on = !!m[t.slug];
    if (on) mastered++;
    const card = document.getElementById(`t${i}`);
    if (card) card.classList.toggle("mastered", on);
  });
  const el = document.getElementById("g-mastered");
  if (el) el.textContent = `${mastered} / ${TERMS.length}`;
  // Mark chapter pills as mastered when 80%+ of their terms are done
  const byChapter: Record<number, { done: number; total: number }> = {};
  TERMS.forEach((t) => {
    const bucket = byChapter[t.chapterIndex] || (byChapter[t.chapterIndex] = { done: 0, total: 0 });
    bucket.total++;
    if (m[t.slug]) bucket.done++;
  });
  for (const [chIdx, c] of Object.entries(byChapter)) {
    const pill = document.getElementById(`pill-${chIdx}`);
    if (pill) pill.classList.toggle("mastered", c.done >= Math.ceil(c.total * 0.8));
  }
}

function toggleMastery(idx: number): void {
  const term = TERMS[idx]; if (!term) return;
  const m = loadMastery();
  m[term.slug] = !m[term.slug];
  if (m[term.slug]) {
    bumpStreak();
    if (window.confetti) window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.75 } });
  }
  saveMastery(m);
  applyMasteryToUI();
  emitBus({ type: "mastery-change" });
}

// ──────────────────────────────────────────────────────────────────────
// 3. STREAK + STUDY TIMER
// ──────────────────────────────────────────────────────────────────────
interface StudySession { byDay: Record<string, number>; lifetime: number; }
const STUDY_KEY = "study.sessions";
const STREAK_MIN_SECONDS = 5 * 60;

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const TIMER = {
  running: false,
  lastTick: 0,
  sessions: kvGet<StudySession>(STUDY_KEY, { byDay: {}, lifetime: 0 }),
};

function todaySeconds(): number { return TIMER.sessions.byDay[todayISO()] || 0; }

function fmtClock(sec: number): string {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function fmtTotal(sec: number): string {
  if (sec < 3600) return `total ${Math.floor(sec / 60)}m`;
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return `total ${h}h ${m}m`;
}
function renderTimer(): void {
  const clock = document.getElementById("st-clock");
  const total = document.getElementById("st-total");
  const go = document.getElementById("st-go");
  const t = todaySeconds();
  if (clock) {
    clock.textContent = fmtClock(t);
    const milestone = t >= STREAK_MIN_SECONDS;
    clock.className = "st-clock" + (TIMER.running ? " running" : "") + (milestone ? " milestone" : "");
  }
  if (total) total.textContent = fmtTotal(TIMER.sessions.lifetime);
  if (go) { go.textContent = TIMER.running ? "⏸" : "▶"; go.classList.toggle("running", TIMER.running); }
}
function persistSessions(): void { kvSet(STUDY_KEY, TIMER.sessions); }

function tickTimer(): void {
  if (!TIMER.running) return;
  const now = Date.now();
  const dt = Math.floor((now - TIMER.lastTick) / 1000);
  if (dt <= 0) return;
  TIMER.lastTick = now;
  const day = todayISO();
  TIMER.sessions.byDay[day] = (TIMER.sessions.byDay[day] || 0) + dt;
  TIMER.sessions.lifetime += dt;
  if (TIMER.sessions.byDay[day] >= STREAK_MIN_SECONDS &&
      TIMER.sessions.byDay[day] - dt < STREAK_MIN_SECONDS) {
    bumpStreak();
  }
  persistSessions();
  renderTimer();
  emitBus({ type: "timer-tick", secondsToday: TIMER.sessions.byDay[day], totalSeconds: TIMER.sessions.lifetime });
}

function wireTimer(): void {
  document.getElementById("st-go")?.addEventListener("click", () => {
    TIMER.running = !TIMER.running;
    TIMER.lastTick = Date.now();
    renderTimer();
  });
  document.getElementById("st-rs")?.addEventListener("click", () => {
    if (!confirm("Reset today's study time? Lifetime total preserved.")) return;
    TIMER.running = false;
    const d = todayISO();
    const lost = TIMER.sessions.byDay[d] || 0;
    TIMER.sessions.byDay[d] = 0;
    TIMER.sessions.lifetime = Math.max(0, TIMER.sessions.lifetime - lost);
    persistSessions();
    renderTimer();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && TIMER.running) tickTimer();
    TIMER.lastTick = Date.now();
  });
  onBus((e) => {
    // Same-tab fanout: re-render UI from in-memory state; do NOT re-read
    // localStorage (the write may still be queued).
    if (e._local) {
      if (e.type === "streak-bump") renderStreak();
      if (e.type === "mastery-change") applyMasteryToUI();
      return;
    }
    // Cross-tab events: pull fresh values from localStorage.
    if (e.type === "timer-tick" || e.type === "streak-bump" || (e.type === "kv-set" && e.key === STUDY_KEY)) {
      TIMER.sessions = kvGet<StudySession>(STUDY_KEY, { byDay: {}, lifetime: 0 });
      renderTimer();
      renderStreak();
    }
    if (e.type === "mastery-change" || (e.type === "kv-set" && e.key === MASTERY_KEY)) {
      applyMasteryToUI();
    }
  });
  renderTimer();
  setInterval(tickTimer, 1000);
}

function renderStreak(): void {
  const s = getStreak();
  const el = document.getElementById("g-day-streak");
  if (el) el.textContent = `${s.count}🔥`;
}

// ──────────────────────────────────────────────────────────────────────
// 4. SPEAKBACK (elocution)
// ──────────────────────────────────────────────────────────────────────
type SBStore = Record<string, { best: number; lastTranscript: string; lastAt: number }>;
const SB_KEY = "speakback";
function sbState(): SBStore { return kvGet<SBStore>(SB_KEY, {}); }
function sbSave(s: SBStore): void { kvSet(SB_KEY, s); }

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function getSbTargets(idx: number): { label: string; text: string }[] {
  const el = document.getElementById(`sb-targets-${idx}`);
  if (!el) return [];
  try { return JSON.parse(el.textContent || "[]"); } catch { return []; }
}
function getSbActiveTarget(idx: number): { label: string; text: string } | null {
  const targets = getSbTargets(idx);
  if (!targets.length) return null;
  const host = document.getElementById(`sb-${idx}`);
  const pick = parseInt(host?.dataset.pick || "0", 10);
  return targets[pick] || targets[0];
}
function renderSbBest(idx: number, label: string): void {
  const best = sbState()[`${idx}:${label}`]?.best ?? 0;
  const el = document.getElementById(`sb-b-${idx}`);
  if (el) el.textContent = best > 0 ? `best ${best}%` : "";
}
function pickSbTarget(idx: number, pickIdx: number): void {
  const host = document.getElementById(`sb-${idx}`);
  if (!host) return;
  host.dataset.pick = String(pickIdx);
  const targets = getSbTargets(idx);
  const t = targets[pickIdx];
  if (!t) return;
  const targetEl = document.getElementById(`sb-target-${idx}`);
  if (targetEl) targetEl.textContent = t.text;
  host.querySelectorAll<HTMLElement>(".sb-pick").forEach((b, i) => b.classList.toggle("active", i === pickIdx));
  const meter = document.getElementById(`sb-m-${idx}`); if (meter) meter.hidden = true;
  const result = document.getElementById(`sb-r-${idx}`);
  if (result) { result.classList.remove("heard"); result.innerHTML = `Tap <b>Hear it first</b> to listen, then <b>Say it back</b>.`; }
  renderSbBest(idx, t.label);
}

interface SRType { new(): SRInstance; }
interface SRInstance extends EventTarget {
  lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean;
  start(): void; stop(): void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
}
function getSR(): SRType | null {
  const w = window as any;
  return (w.SpeechRecognition || w.webkitSpeechRecognition) ?? null;
}
const sbActive: Record<number, SRInstance | null> = {};

async function speakBackHear(idx: number): Promise<void> {
  const host = document.getElementById(`sb-${idx}`);
  if (!host) return;
  const active = getSbActiveTarget(idx);
  const text = active?.text || "";
  await speakViaConfig(
    `sb-${idx}-${active?.label || "default"}`,
    text,
    { tag: `sb-hear-${idx}` },
    () => {
      const r = document.getElementById(`sb-r-${idx}`);
      if (r) r.textContent = `${getTTSConfig().backend} unavailable — open Settings.`;
    },
  );
}

async function speakBackListen(idx: number): Promise<void> {
  const host = document.getElementById(`sb-${idx}`);
  const result = document.getElementById(`sb-r-${idx}`);
  const meter = document.getElementById(`sb-m-${idx}`);
  const fill = document.getElementById(`sb-f-${idx}`);
  const score = document.getElementById(`sb-s-${idx}`);
  const btn = host?.querySelector<HTMLButtonElement>(`button[data-act="sb-listen"]`);
  if (!host || !result || !btn) return;
  if (sbActive[idx]) {
    try { sbActive[idx]!.stop(); } catch {}
    sbActive[idx] = null;
    btn.classList.remove("recording");
    btn.textContent = "🎤 SAY IT BACK";
    return;
  }
  const SR = getSR();
  if (!SR) { result.textContent = "Browser doesn't support SpeechRecognition. Try Chrome / Safari."; return; }
  const rec = new SR();
  rec.lang = "en-US"; rec.interimResults = true; rec.maxAlternatives = 3; rec.continuous = true;
  const active = getSbActiveTarget(idx);
  const target = active?.text || "";
  const activeLabel = active?.label || "Target";
  let finalText = "";
  result.classList.remove("heard");
  result.textContent = "Listening — speak now…";
  btn.classList.add("recording");
  btn.textContent = "■ STOP";
  rec.onresult = (e: any) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript + " ";
      else interim += r[0].transcript;
    }
    const heard = (finalText + interim).trim();
    if (heard) { result.classList.add("heard"); result.innerHTML = `Heard: ${speakDiffMarkup(target, heard)}`; }
  };
  rec.onerror = (e: any) => {
    result.textContent = `Mic error: ${e.error || "unknown"} — check permissions.`;
    btn.classList.remove("recording");
    btn.textContent = "🎤 SAY IT BACK";
    sbActive[idx] = null;
  };
  rec.onend = () => {
    btn.classList.remove("recording");
    btn.textContent = "🎤 SAY IT BACK";
    sbActive[idx] = null;
    const heard = finalText.trim();
    if (!heard) { result.textContent = "Nothing heard — try again, a bit louder."; return; }
    const matched = scoreSpeakBack(target, heard);
    const s = matched.score;
    if (meter && fill && score) { meter.hidden = false; fill.style.width = s + "%"; score.textContent = `${s}%`; }
    result.innerHTML = speakDiffMarkup(target, heard);
    const state = sbState();
    const key = `${idx}:${activeLabel}`;
    const prev = state[key]?.best ?? 0;
    state[key] = { best: Math.max(prev, s), lastTranscript: heard, lastAt: Date.now() };
    sbSave(state);
    renderSbBest(idx, activeLabel);
    if (s >= 85) {
      bumpStreak();
      if (window.confetti) window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.75 } });
    }
  };
  sbActive[idx] = rec;
  try { rec.start(); }
  catch (err) {
    result.textContent = `Couldn't start mic: ${(err as Error).message}`;
    btn.classList.remove("recording");
    btn.textContent = "🎤 SAY IT BACK";
    sbActive[idx] = null;
  }
}

// ──────────────────────────────────────────────────────────────────────
// 5. FLASHCARD QUIZ
// ──────────────────────────────────────────────────────────────────────
type QuizMode = "term-to-def" | "def-to-term" | "example-to-term";
interface QuizState { mode: QuizMode; order: number[]; current: number; revealed: boolean; right: number; missed: number; }
let QUIZ: QuizState | null = null;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(mode: QuizMode): QuizState {
  // For example-to-term mode, only include terms that HAVE an example.
  const pool = mode === "example-to-term"
    ? TERMS.map((t, i) => ({ t, i })).filter((x) => !!x.t.example).map((x) => x.i)
    : TERMS.map((_, i) => i);
  return { mode, order: shuffle(pool), current: 0, revealed: false, right: 0, missed: 0 };
}

function renderQuiz(): void {
  if (!QUIZ) return;
  const card = document.getElementById("quiz-card");
  const prog = document.getElementById("quiz-prog");
  const counter = document.getElementById("quiz-counter");
  const reveal = document.getElementById("quiz-reveal");
  const knew = document.getElementById("quiz-knew");
  const missed = document.getElementById("quiz-missed");
  if (!card) return;
  if (QUIZ.current >= QUIZ.order.length) {
    card.innerHTML = `<div class="qprompt">Done</div><div class="qbody">You worked through ${QUIZ.order.length} cards.<br><b>${QUIZ.right}</b> right · <b>${QUIZ.missed}</b> missed.</div>`;
    if (prog) prog.textContent = `${QUIZ.order.length} / ${QUIZ.order.length}`;
    reveal?.setAttribute("hidden", "");
    knew?.setAttribute("hidden", "");
    missed?.setAttribute("hidden", "");
    return;
  }
  const idx = QUIZ.order[QUIZ.current];
  const t = TERMS[idx];
  let prompt = "", body = "", answer = "";
  if (QUIZ.mode === "term-to-def") {
    prompt = "What does this mean?"; body = t.title; answer = t.plain;
  } else if (QUIZ.mode === "def-to-term") {
    prompt = "Name the term"; body = t.plain; answer = t.title;
  } else {
    prompt = "What term does this example illustrate?"; body = t.example || "(no example)"; answer = t.title;
  }
  card.innerHTML = `
    <div class="qprompt">${prompt}</div>
    <div class="qbody">${escapeHtml(body)}</div>
    ${QUIZ.revealed ? `<div class="qanswer">${escapeHtml(answer)}</div>` : ""}
  `;
  if (prog) prog.textContent = `${QUIZ.current + 1} / ${QUIZ.order.length}`;
  if (counter) counter.textContent = `${QUIZ.right} right · ${QUIZ.missed} missed`;
  if (QUIZ.revealed) {
    reveal?.setAttribute("hidden", "");
    knew?.removeAttribute("hidden");
    missed?.removeAttribute("hidden");
  } else {
    reveal?.removeAttribute("hidden");
    knew?.setAttribute("hidden", "");
    missed?.setAttribute("hidden", "");
  }
}

function openQuiz(): void {
  QUIZ = buildQuiz("term-to-def");
  const ov = document.getElementById("quiz-overlay");
  if (ov) ov.style.display = "";
  renderQuiz();
}
function closeQuiz(): void {
  const ov = document.getElementById("quiz-overlay");
  if (ov) ov.style.display = "none";
  QUIZ = null;
}
function setQuizMode(m: QuizMode): void {
  QUIZ = buildQuiz(m);
  document.querySelectorAll<HTMLElement>(".quiz-mode").forEach((el) => {
    el.classList.toggle("active", el.dataset.mode === m);
  });
  renderQuiz();
}
function quizReveal(): void { if (!QUIZ) return; QUIZ.revealed = true; renderQuiz(); }
function quizMark(right: boolean): void {
  if (!QUIZ) return;
  if (right) {
    QUIZ.right++;
    // Auto-mark term mastered when knew it from the term-to-def prompt
    const idx = QUIZ.order[QUIZ.current];
    if (QUIZ.mode === "term-to-def") {
      const m = loadMastery();
      m[TERMS[idx].slug] = true; saveMastery(m); applyMasteryToUI();
    }
    bumpStreak();
  } else QUIZ.missed++;
  QUIZ.current++; QUIZ.revealed = false;
  renderQuiz();
}
function quizSkip(): void { if (!QUIZ) return; QUIZ.current++; QUIZ.revealed = false; renderQuiz(); }

// ──────────────────────────────────────────────────────────────────────
// 6. EVENT WIRING + KEYBOARD
// ──────────────────────────────────────────────────────────────────────
function wireEvents(): void {
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const mode = t.closest<HTMLElement>(".quiz-mode");
    if (mode?.dataset.mode) { setQuizMode(mode.dataset.mode as QuizMode); return; }
    const btn = t.closest<HTMLButtonElement>("button[data-act]");
    if (!btn) return;
    const idx = btn.dataset.idx ? parseInt(btn.dataset.idx, 10) : -1;
    const a = btn.dataset.act!;
    switch (a) {
      case "hear":        void hearTerm(idx); break;
      case "mark":        toggleMastery(idx); break;
      case "sb-hear":     void speakBackHear(idx); break;
      case "sb-listen":   void speakBackListen(idx); break;
      case "sb-pick": {
        const p = parseInt(btn.dataset.pick || "0", 10);
        pickSbTarget(idx, p);
        break;
      }
      case "audio-stop":  AudioBus.stop(); break;
      case "quiz-open":   openQuiz(); break;
      case "quiz-close":  closeQuiz(); break;
      case "quiz-reveal": quizReveal(); break;
      case "quiz-knew":   quizMark(true); break;
      case "quiz-missed": quizMark(false); break;
      case "quiz-skip":   quizSkip(); break;
    }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.target as HTMLElement).matches("textarea, input")) return;
    const overlay = document.getElementById("quiz-overlay");
    const quizOpen = overlay && overlay.style.display !== "none";
    if (quizOpen) {
      if (e.key === "Escape") { e.preventDefault(); closeQuiz(); return; }
      if (e.key === " ")      { e.preventDefault(); if (QUIZ?.revealed) quizMark(true); else quizReveal(); return; }
      if (e.key === "j" || e.key === "J") { e.preventDefault(); quizMark(true); return; }
      if (e.key === "f" || e.key === "F") { e.preventDefault(); quizMark(false); return; }
      if (e.key === "s" || e.key === "S") { e.preventDefault(); quizSkip(); return; }
      return;
    }
    if (e.key === " " && AudioBus.current) { e.preventDefault(); AudioBus.togglePause(); }
    if ((e.key === "q" || e.key === "Q") && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openQuiz(); }
  });
}

// ──────────────────────────────────────────────────────────────────────
// BOOTSTRAP
// ──────────────────────────────────────────────────────────────────────
function boot(): void {
  applyMasteryToUI();
  renderStreak();
  wireEvents();
  wireTimer();
  setInterval(renderStreak, 5000);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
