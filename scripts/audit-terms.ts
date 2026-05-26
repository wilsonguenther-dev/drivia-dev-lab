/**
 * Drift guard for Dev Lab — every term must have a plain English field.
 * Counts and reports any missing analogy/example/whenToUse/watchOut.
 */
import { TERMS, CHAPTERS } from "../src/data/terms";

let missingPlain = 0;
let missingAnalogy = 0;
let missingExample = 0;
let missingWhen = 0;
let missingWatch = 0;

for (const t of TERMS) {
  if (!t.plain || t.plain.length < 10) {
    console.error(`  ✗ ${t.title} — missing plain English`);
    missingPlain++;
  }
  if (!t.analogy) missingAnalogy++;
  if (!t.example) missingExample++;
  if (!t.whenToUse) missingWhen++;
  if (!t.watchOut) missingWatch++;
}

console.log(`\nDev Lab audit — ${TERMS.length} terms across ${CHAPTERS.length} chapters`);
console.log(`  Missing plain English: ${missingPlain}`);
console.log(`  Missing analogy:       ${missingAnalogy}`);
console.log(`  Missing example:       ${missingExample}`);
console.log(`  Missing when-to-use:   ${missingWhen}`);
console.log(`  Missing watch-out:     ${missingWatch}`);

if (missingPlain > 0) {
  console.error(`\nDrift detected — ${missingPlain} terms are missing the required Plain English field. ✗`);
  process.exit(1);
}
console.log(`\nAll terms have Plain English. ✓\n`);
process.exit(0);
