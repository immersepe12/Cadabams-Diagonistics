// Local content audit: scans the repo's _shared JSON datasets and grades every
// detail page (lab tests, scans, blogs, centers) using the EXACT render gates
// from the page components (see scripts/audit/gates.mjs).
//
// Output: data/audit/local.csv + a console summary.
// Run: npm run audit:local

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzePage } from "./audit/gates.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHARED = join(ROOT, "data", "allpages", "_shared");
const OUT_DIR = join(ROOT, "data", "audit");

function loadJson(name) {
  return JSON.parse(readFileSync(join(SHARED, name), "utf8"));
}

const stripSlash = (s) => (s ? String(s).replace(/^\/+/, "") : "");
const slugifyLocation = (s) =>
  String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// --- load datasets --------------------------------------------------------
const labtests = loadJson("labtests.json");
const nonlabtests = loadJson("nonlabtests.json");
const nonlabCategories = loadJson("nonlabtest-categories.json");
const blogs = loadJson("blogs.json").filter((b) => b.pageState === "publish");
const centers = loadJson("centerpages.json");

// scan family slug per category id (mirrors lib/urls.ts nonLabTestUrl)
const familyByCatId = new Map(
  nonlabCategories.map((c) => [c.id, stripSlash(c.path) || "scan"]),
);

// --- build the audit rows -------------------------------------------------
const rows = [];

function push(url, type, name, record) {
  const r = analyzePage(record, type);
  rows.push({
    url,
    type,
    name,
    severity: r.severity,
    coreMissing: r.coreMissing.join("|"),
    missing: r.missing.join("|"),
    present: r.present.join("|"),
  });
}

for (const t of labtests) {
  push(`/bangalore/lab-test/${stripSlash(t.route)}`, "labtest", t.testName, t);
}
for (const t of nonlabtests) {
  const family = familyByCatId.get(t.basic_info?.categoryId) ?? "scan";
  push(`/bangalore/${family}/${stripSlash(t.route)}`, "scan", t.testName, t);
}
for (const b of blogs) {
  push(`/blogs/${stripSlash(b.route)}`, "blog", b.title, b);
}
for (const c of centers) {
  const slug = slugifyLocation(c.basic_info?.location);
  push(`/bangalore/center/${slug}`, "center", c.basic_info?.center_name, c);
}

// --- write CSV ------------------------------------------------------------
const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const header =
  "url,type,severity,core_missing,missing_sections,present_sections,name";
const body = rows
  .map((r) =>
    [r.url, r.type, r.severity, r.coreMissing, r.missing, r.present, r.name]
      .map(csvCell)
      .join(","),
  )
  .join("\n");

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "local.csv"), `${header}\n${body}\n`, "utf8");

// --- console summary ------------------------------------------------------
const types = ["labtest", "scan", "blog", "center"];
const sevs = ["EMPTY", "THIN", "OK"];
const count = (type, sev) =>
  rows.filter((r) => r.type === type && r.severity === sev).length;

console.log(`\nLocal content audit — ${rows.length} pages\n`);
const pad = (s, n) => String(s).padEnd(n);
console.log(
  pad("TYPE", 10) +
    sevs.map((s) => pad(s, 8)).join("") +
    pad("TOTAL", 8),
);
console.log("-".repeat(42));
for (const type of types) {
  const total = rows.filter((r) => r.type === type).length;
  console.log(
    pad(type, 10) +
      sevs.map((s) => pad(count(type, s), 8)).join("") +
      pad(total, 8),
  );
}
console.log("-".repeat(42));
console.log(
  pad("ALL", 10) +
    sevs
      .map((s) => pad(rows.filter((r) => r.severity === s).length, 8))
      .join("") +
    pad(rows.length, 8),
);

const empties = rows.filter((r) => r.severity === "EMPTY");
console.log(`\nEMPTY pages (whole main content blank): ${empties.length}`);
for (const r of empties.slice(0, 25)) {
  console.log(`  [${r.type}] ${r.url}`);
}
if (empties.length > 25) console.log(`  ... and ${empties.length - 25} more`);
console.log(`\nFull results: data/audit/local.csv\n`);
