# Drivia Dev Lab

**Read · Hear · Speak · Master.** A developer-vocabulary lab. 16 chapters, 161 terms. Plain English first, then analogy, then real-world example, then *when to use this*, then *what to watch out for*. The pattern that turns "I sort of know what 'integration test' means" into *I can hold my own in the meeting*.

Built solo, in a dorm room, by [Wilson Guenther](https://github.com/wilsonguenther-dev) — founder of [Drivia](https://drivia.consulting). The Drivia open-source layer — fork it, run it, learn from it.

Companion repos:
- [`drivia-formula-lab`](https://github.com/wilsonguenther-dev/drivia-formula-lab) — linear algebra + ML formulas
- `drivia-cs-lab` — computer-science curriculum undergrad → PhD

---

## What's inside

Each of the **161 terms** uses the same five-field shape so the format becomes second nature:

| Field | What it is |
|---|---|
| **Plain English** | One paragraph. No jargon. Pretend you're explaining it to a sharp non-engineer. |
| **Analogy** | A non-software comparison that makes the shape click (testing salt ≠ testing the whole soup). |
| **Example** | A concrete one — usually from a real production system. |
| **When to use** | The decision rule: *reach for this when…* |
| **Watch out** | The trap. The thing that gets you fired or stays bug-eyed in prod. |

### 16 chapter spine

1. **Testing** — unit, integration, e2e, mocking, fakes, fixtures, smoke
2. **Software architecture** — services, monoliths, microservices, modular monoliths, hexagonal
3. **Data & state** — caching, persistence, idempotency, eventual consistency, ACID, CAP
4. **Distributed systems** — load balancers, queues, pub/sub, RPC, retries, circuit breakers
5. **API design** — REST, GraphQL, gRPC, versioning, pagination, contracts
6. **Auth** — OAuth, OIDC, JWT, sessions, RBAC, ABAC, SAML
7. **Performance** — latency, throughput, p95/p99, profiling, hot paths, n+1
8. **Reliability** — SLA/SLO/SLI, error budgets, observability, tracing, alerting
9. **Security** — OWASP top 10, XSS, CSRF, SSRF, secrets management, threat modeling
10. **Networking** — TCP/UDP, TLS, DNS, CDN, HTTP/2, HTTP/3
11. **Storage** — SQL vs NoSQL, indexes, partitioning, replication, sharding
12. **DevOps & release** — CI/CD, canary, blue-green, feature flags, rollbacks
13. **Cloud primitives** — IaC, containers, k8s primitives, autoscaling, spot vs reserved
14. **Frontend** — hydration, SSR/SSG/ISR, accessibility, web vitals
15. **AI / ML / inference** — embeddings, RAG, fine-tuning, quantization, prompt caching
16. **Team & process** — RFCs, postmortems, on-call, escalation paths, code review

Plus: SpeakBack (mic-graded say-it-back drill), per-term flashcard quiz, mastery toggles propagating to chapter pills, notes pad per chapter, day-streak counter.

The 161 terms are **auto-generated from a single source-of-truth PDF** (Wilson's CTO Vocabulary Guide). Regenerate with `npm run parse-vocab` after the PDF updates.

---

## Getting started

### Requirements

- Node 20+

The lab runs with **zero TTS setup** — the default backend is the browser's built-in Web Speech API.

### Install + run

```bash
git clone https://github.com/wilsonguenther-dev/drivia-dev-lab.git
cd drivia-dev-lab
npm install
npm run dev          # → http://localhost:4321
```

### TTS options

Click the gear icon (bottom-right) to switch between:

1. **Web Speech** (default) — browser native, zero install
2. **Supersonic2** — local ONNX TTS, [setup guide](./TTS.md#supersonic2)
3. **Kokori** — Kokoro-82M wrapper on `localhost:3000` (Mac convenience)
4. **Gemini Charon** — pre-baked WAVs (requires `GEMINI_API_KEY` at bake time)

See [TTS.md](./TTS.md) for the full setup matrix.

### Production build

```bash
npm run build        # SSR build in dist/
npm start            # serves dist/server/entry.mjs
npm run smoke        # real-browser Playwright smoke test
```

---

## Architecture

```
src/
├── components/
│   ├── TermCard.astro           The 5-field term shell
│   ├── QuizPanel.astro          Cross-chapter flashcard quiz
│   ├── NotesPad.astro           Per-chapter notes (localStorage)
│   ├── SpeakBack.astro          Mic-graded say-it-back
│   ├── StudyTimer.astro         Persistent study counter
│   ├── TopRail.astro            Chapter pills + audio-stop badge
│   ├── KeyboardHelp.astro       `?` overlay
│   ├── Layout.astro             Page chrome + TTS gear injection
│   └── TTSSettings.astro        TTS backend picker (gear button)
├── data/
│   └── terms.ts                 Auto-generated from the vocab PDF
├── lib/
│   ├── tts.ts                   Pluggable TTS adapter (4 backends)
│   ├── cache.ts                 IDB blob + KV layer
│   ├── speakmatch.ts            Mic transcript → score
│   └── mastery.ts               Per-term mastery + day-streak
├── pages/
│   ├── index.astro              The long-scroll lab
│   ├── audit.astro              Self-check: which terms need attention
│   └── api/
│       └── explain.ts           Gemini fallback for "explain this differently"
└── scripts/
    ├── main.ts                  Client orchestrator
    └── parse-vocab.ts           PDF → terms.ts code generator
```

### TTS pipeline

```
                 ┌────────────────────────────┐
   term text →   │  lib/tts.ts                │
                 │  • getTTSConfig()          │  ← persisted in localStorage
                 │  • fetchTTSBlob() / Web    │
                 │    Speech direct           │
                 └──────┬─────────────────────┘
                        │
        ┌───────────────┼───────────────┬──────────────┐
        ▼               ▼               ▼              ▼
   webspeech       supersonic         kokori      gemini-baked
   (native)     :8800 ONNX shim    :3000 K-82M    /audio/*.wav
                        │               │              │
                        └────── Blob ───┴──── URL.createObjectURL ──┐
                                                                    ▼
                                                            AudioBus.play()
                                                          (single global track)
```

---

## Tech stack

- **Astro 5** with React 18 islands
- **Web Speech API** as the zero-install default
- **[Supersonic2](https://github.com/DavidValin/supersonic2-tts)** for high-quality offline ONNX TTS
- **[Kokoro 82M](https://huggingface.co/hexgrad/Kokoro-82M)** as the Mac-convenience backend
- **Gemini 2.5 Flash TTS** (Charon voice) for the baked path
- **MediaRecorder + SpeechRecognition** for SpeakBack
- **IndexedDB** for blob persistence, **localStorage** for KV / mastery / streak / TTS prefs

---

## Roadmap

- More chapters: data engineering, MLOps, regulatory (HIPAA / SOC 2 / GDPR / FERPA)
- "Watch out" rewrites driven by user-flagged terms (the post-quiz wrong-answer pattern)
- Light-mode theme

PRs welcome — especially term entries you wish someone had explained to you the first time.

---

## License

MIT © 2026 Wilson Guenther / Drivia Consulting LLC.

Drivia is an AI education platform. The Dev Lab is one of the open-source layers — the part anyone can read, fork, run, and learn from. Find Drivia at [drivia.consulting](https://drivia.consulting).
