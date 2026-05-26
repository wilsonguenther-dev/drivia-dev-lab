/**
 * Real-browser smoke test for Dev Lab. Run via `npm run smoke`.
 *
 * Dev server defaults to :4322 but Astro auto-bumps if taken; override with
 * SMOKE_URL if needed.
 */
import { chromium } from "playwright";

const URL = process.env.SMOKE_URL || "http://localhost:4322/";

function ok(label: string, value: unknown): void {
  console.log(`  ✓ ${label}`, value === undefined ? "" : `→ ${JSON.stringify(value)}`);
}
let failures = 0;
function fail(label: string, value: unknown): void {
  console.error(`  ✗ ${label}`, value === undefined ? "" : `→ ${JSON.stringify(value)}`);
  failures++;
}
const errs: string[] = [];

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext()).newPage();
page.on("pageerror", (e) => errs.push("pageerror: " + e.message));

console.log(`Smoke test — ${URL}\n`);
await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(500);

const s = await page.evaluate(() => ({
  cards: document.querySelectorAll(".card").length,
  chapters: document.querySelectorAll(".chapter-hdr").length,
  clock: document.getElementById("st-clock")?.textContent,
}));
s.cards >= 100 ? ok("100+ term cards", s.cards) : fail("card count", s.cards);
s.chapters === 16 ? ok("16 chapter headers", s.chapters) : fail("chapter count", s.chapters);
s.clock ? ok("clock present", s.clock) : fail("clock missing", null);

// Timer
await page.click("#st-go");
await page.waitForTimeout(2400);
const t = await page.evaluate(() => document.getElementById("st-clock")?.textContent);
parseInt(t!.split(":")[1], 10) >= 1 ? ok("timer ticked past 00:01", t) : fail("timer didn't tick", t);
await page.click("#st-go");

// Mark mastery
await page.click('button[data-act="mark"][data-idx="0"]');
await page.waitForTimeout(400);
const m = await page.evaluate(() => ({
  mastered: document.getElementById("g-mastered")?.textContent,
  card: document.getElementById("t0")?.classList.contains("mastered"),
}));
m.card && m.mastered?.startsWith("1") ? ok("Mastery toggle updated", m) : fail("Mastery toggle UI", m);

// Quiz
await page.click("#g-quiz-btn");
await page.waitForTimeout(400);
const q1 = await page.evaluate(() => ({
  open: document.getElementById("quiz-overlay")?.style.display !== "none",
  body: document.querySelector(".qbody")?.textContent?.trim()?.slice(0, 80),
}));
q1.open && q1.body ? ok("Quiz overlay opened", q1.body) : fail("Quiz overlay", q1);

await page.click("button[data-act='quiz-reveal']");
await page.waitForTimeout(200);
const q2 = await page.evaluate(() => document.querySelector(".qanswer")?.textContent?.slice(0, 80) || "");
q2 ? ok("Reveal answer", q2) : fail("Reveal didn't show answer", null);

await page.click("button[data-act='quiz-close']");

if (errs.length) {
  console.error("\n  Page-level errors:");
  errs.forEach((e) => console.error("    " + e));
  failures += errs.length;
}

await browser.close();
console.log(`\n${failures === 0 ? "All smoke checks passed. ✓" : `${failures} smoke check(s) failed. ✗`}\n`);
process.exit(failures === 0 ? 0 : 1);
