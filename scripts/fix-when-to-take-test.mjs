// Standardize the existing "when/reasons to take" heading on the 192 scan pages
// flagged for a missing "When to Take Test" section. The content already exists
// under descriptive headings (e.g. "When and Who Needs to Take an X?",
// "Reasons for Taking an X") — this renames ONE such heading per page to the
// canonical "When to Take Test" so the section is present and consistent,
// reusing the real (medically-accurate) prose rather than fabricating any.
//
// Run: node scripts/fix-when-to-take-test.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHARED = join(__dirname, "..", "data", "allpages", "_shared");
const FILE = join(SHARED, "nonlabtests.json");
const strip = (s) => (s ? String(s).replace(/^\/+/, "") : "");

const issues = JSON.parse(
  readFileSync(join(__dirname, "..", "data", "audit", "page-issues.json"), "utf8"),
);
const wtt = new Set(
  (issues["missing-section-when-to-take-test"]?.urls ?? []).map((u) =>
    strip(new URL(u).pathname.split("/").pop()),
  ),
);

const tests = JSON.parse(readFileSync(FILE, "utf8"));

// Choose the heading to rename: prefer one containing "when" (but never the
// separate "Why This Test" section), else who-needs / reasons / indications.
function chooseHeading(headings) {
  let h = headings.find((x) => /\bwhen\b/i.test(x) && !/why this/i.test(x));
  if (!h) h = headings.find((x) => /(who (needs|should)|reasons? for|indication)/i.test(x));
  return h || null;
}

let changed = 0;
const skipped = [];
for (const t of tests) {
  if (!wtt.has(strip(t.route))) continue;
  const md = t.markdown ?? "";
  const headings = [...md.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1].trim());
  const chosen = chooseHeading(headings);
  if (!chosen) {
    skipped.push(strip(t.route));
    continue;
  }
  if (headings.includes("When to Take Test")) continue; // already standardized
  // Replace only the first matching H2 line.
  const lines = md.split(/\r?\n/);
  let done = false;
  for (let i = 0; i < lines.length && !done; i++) {
    const m = lines[i].match(/^##\s+(.+?)\s*$/);
    if (m && m[1].trim() === chosen) {
      lines[i] = "## When to Take Test";
      done = true;
    }
  }
  if (done) {
    t.markdown = lines.join("\n");
    changed++;
  } else {
    skipped.push(strip(t.route));
  }
}

writeFileSync(FILE, JSON.stringify(tests, null, 2).replace(/\n/g, "\r\n") + "\r\n", "utf8");
console.log(`Standardized "When to Take Test" on ${changed} pages.`);
if (skipped.length) console.log(`Skipped (${skipped.length}):`, skipped.join(", "));
