/**
 * Wilson's CTO Vocabulary Guide → typed terms.ts.
 *
 * The PDF has a strict structure: each term is a short header line followed
 * by `PLAIN ENGLISH` (and optional ANALOGY / EXAMPLE / WHEN TO USE IT /
 * WATCH OUT FOR / FORMULA / RULE). Chapter headers look like `1. Testing`.
 *
 * Algorithm:
 *   1. Walk text line by line, keeping `pendingHeader` = the most recent
 *      short non-prose line we saw.
 *   2. When we hit `PLAIN ENGLISH`, that pendingHeader is the term name.
 *      Close any previous term, open this one.
 *   3. Subsequent lines append to the active section until another section
 *      label, a new pendingHeader+PLAIN ENGLISH, or a chapter header.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const PDF = "/Users/wilsonguenther/Desktop/_Organized/Drivia/Wilson-Developer-Vocab-Guide.pdf";
const OUT = path.resolve("src/data/terms.ts");

const raw = execSync(`pdftotext -layout "${PDF}" -`).toString();

const SECTION_LABELS = [
  "PLAIN ENGLISH",
  "ANALOGY",
  "EXAMPLE",
  "WHEN TO USE IT",
  "WATCH OUT FOR",
  "FORMULA / RULE",
] as const;
type SectionLabel = typeof SECTION_LABELS[number];

const labelToField: Record<SectionLabel, string> = {
  "PLAIN ENGLISH": "plain",
  "ANALOGY": "analogy",
  "EXAMPLE": "example",
  "WHEN TO USE IT": "whenToUse",
  "WATCH OUT FOR": "watchOut",
  "FORMULA / RULE": "rule",
};

interface ParsedTerm {
  slug: string;
  title: string;
  chapterIndex: number;
  chapterTitle: string;
  plain: string;
  analogy?: string;
  example?: string;
  whenToUse?: string;
  watchOut?: string;
  rule?: string;
}
interface ParsedChapter {
  index: number;
  title: string;
  blurb: string;
  terms: ParsedTerm[];
}

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Drop page-header / page-number lines and normalize whitespace
const lines = raw.split("\n")
  .map((l) => l.replace(/\s+$/, ""))
  .filter((l) =>
    !/^The Drivia CTO Vocabulary Guide · Wilson Guenther/.test(l) &&
    !/^\s*Page \d+\s*$/.test(l)
  )
  .map((l) => l.trim());

const chapters: ParsedChapter[] = [];
let chapter: ParsedChapter | null = null;
let term: ParsedTerm | null = null;
let activeLabel: SectionLabel | null = null;
let pendingHeader: string | null = null;
let chapterBlurbCapture = false;
let chapterBlurbBuf: string[] = [];

function isChapterHeader(line: string): { idx: number; title: string } | null {
  const m = line.match(/^(\d{1,2})\.\s+(.+)$/);
  if (!m) return null;
  // Reject section-label-style noise: chapter titles use Title Case.
  const title = m[2].trim();
  if (title.length < 3 || title.length > 60) return null;
  if (/^(true|false)$/i.test(title)) return null;
  return { idx: parseInt(m[1], 10), title };
}

function appendToSection(text: string): void {
  if (!term || !activeLabel) return;
  const field = labelToField[activeLabel];
  const cur = (term as any)[field] || "";
  (term as any)[field] = (cur ? cur + " " : "") + text;
}

function closeTerm(): void {
  if (!term || !chapter) { term = null; activeLabel = null; return; }
  for (const lab of SECTION_LABELS) {
    const f = labelToField[lab];
    const v = (term as any)[f] as string | undefined;
    if (typeof v === "string") (term as any)[f] = v.replace(/\s+/g, " ").trim();
  }
  chapter.terms.push(term);
  term = null;
  activeLabel = null;
}

function flushChapterBlurb(): void {
  if (chapter && chapterBlurbBuf.length) {
    chapter.blurb = chapterBlurbBuf.join(" ").replace(/\s+/g, " ").trim();
  }
  chapterBlurbBuf = [];
  chapterBlurbCapture = false;
}

for (const line of lines) {
  if (!line) continue;

  // Chapter header — only when we're not deep inside a section. The very
  // first occurrence after the prologue opens chapter 1.
  const ch = isChapterHeader(line);
  if (ch) {
    closeTerm();
    flushChapterBlurb();
    chapter = { index: ch.idx, title: ch.title, blurb: "", terms: [] };
    chapters.push(chapter);
    chapterBlurbCapture = true;
    pendingHeader = null;
    continue;
  }

  if (!chapter) continue; // still in front-matter

  // Section label?
  if (SECTION_LABELS.includes(line as SectionLabel)) {
    const lab = line as SectionLabel;
    if (lab === "PLAIN ENGLISH" && pendingHeader) {
      closeTerm();
      flushChapterBlurb();
      term = {
        slug: slugify(pendingHeader),
        title: pendingHeader,
        chapterIndex: chapter.index,
        chapterTitle: chapter.title,
        plain: "",
      };
      pendingHeader = null;
    }
    activeLabel = lab;
    continue;
  }

  // Active section: append the line to the section text.
  if (term && activeLabel) {
    // Short capitalized lines mid-section MIGHT be the next term header.
    // Detect: short, not ending with punctuation, no spaces or ≤4 words,
    // and Title-Cased.
    const looksLikeHeader =
      line.length <= 60 &&
      !/[.?!:;,]$/.test(line) &&
      /^[A-Z]/.test(line) &&
      line.split(/\s+/).length <= 5;
    if (looksLikeHeader) {
      pendingHeader = line;
      continue;
    }
    appendToSection(line);
    continue;
  }

  // Outside any section but inside a chapter — could be:
  //   • chapter blurb (one-line dek that follows the chapter header)
  //   • a stray term header awaiting its PLAIN ENGLISH label
  if (chapterBlurbCapture && /[.?!]\s*$/.test(line)) {
    chapterBlurbBuf.push(line);
    continue;
  }
  // Otherwise treat as a pending term header
  pendingHeader = line;
}
closeTerm();
flushChapterBlurb();

const ts = `/**
 * Auto-generated from Wilson's CTO Vocabulary Guide PDF.
 * Source: ~/Desktop/_Organized/Drivia/Wilson-Developer-Vocab-Guide.pdf
 * Regenerate via \`npm run parse-vocab\`.
 *
 * DO NOT hand-edit. The PDF is the source of truth.
 */

export interface DevTerm {
  slug: string;
  title: string;
  chapterIndex: number;
  chapterTitle: string;
  plain: string;
  analogy?: string;
  example?: string;
  whenToUse?: string;
  watchOut?: string;
  rule?: string;
}

export interface DevChapter {
  index: number;
  title: string;
  blurb: string;
  terms: DevTerm[];
}

export const CHAPTERS: DevChapter[] = ${JSON.stringify(chapters, null, 2)};

export const TERMS: DevTerm[] = CHAPTERS.flatMap((c) => c.terms);
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, ts);
console.log(`Wrote ${OUT}`);
console.log(`Parsed ${chapters.length} chapters · ${chapters.reduce((a, c) => a + c.terms.length, 0)} terms`);
for (const c of chapters) console.log(`  ${c.index}. ${c.title} — ${c.terms.length} terms`);
