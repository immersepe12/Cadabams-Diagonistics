// Build a simple JSON list of problem pages: { name, issue, url }.
// Resolves the human test/page name from the source data by slug.
//
// Output: data/audit/page-issues.json
// Run: node scripts/audit-issues-json.mjs   (run audit:live + audit:missing first)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHARED = join(ROOT, "data", "allpages", "_shared");
const OUT_DIR = join(ROOT, "data", "audit");

function parseCsv(t) {
  const rows = [];
  let r = [], c = "", q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) {
      if (ch === '"' && t[i + 1] === '"') { c += '"'; i++; }
      else if (ch === '"') q = false;
      else c += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { r.push(c); c = ""; }
    else if (ch === "\n") { r.push(c); rows.push(r); r = []; c = ""; }
    else if (ch !== "\r") c += ch;
  }
  if (c.length || r.length) { r.push(c); rows.push(r); }
  const h = rows.shift();
  return rows.filter((x) => x.length > 1).map((x) => Object.fromEntries(h.map((k, i) => [k, x[i] ?? ""])));
}

const strip = (s) => (s ? String(s).replace(/^\/+/, "") : "");
const loadJson = (f) => JSON.parse(readFileSync(join(SHARED, f), "utf8"));

// slug -> name maps from source data
const nameBySlug = new Map();
for (const t of loadJson("labtests.json")) nameBySlug.set(strip(t.route), t.testName);
for (const t of loadJson("nonlabtests.json")) nameBySlug.set(strip(t.route), t.testName);
for (const b of loadJson("blogs.json")) nameBySlug.set(strip(b.route), b.title);

const MISSING = join(OUT_DIR, "missing-sections.csv");
if (!existsSync(MISSING)) {
  console.error("Missing data/audit/missing-sections.csv — run `npm run audit:missing` first.");
  process.exit(1);
}
const rows = parseCsv(readFileSync(MISSING, "utf8"));

// Pretty-name fallback from a slug, e.g. "abdomen-and-lower-thorax-ct-scan"
const titleize = (slug) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const BASE = "https://cadabamsdiagnostics.com";
const slugOf = (url) => strip(new URL(url).pathname.split("/").pop());
const nameFromUrl = (url) => nameBySlug.get(slugOf(url)) || titleize(slugOf(url));

// --- source state, to mark issues already fixed (pending deploy) ----------
const nonlab = loadJson("nonlabtests.json");
const lab = loadJson("labtests.json");
const allSlugs = new Set();
for (const f of ["labtests.json", "nonlabtests.json", "blogs.json"])
  for (const x of loadJson(f)) allSlugs.add(strip(x.route));

// Build a set of slugs whose source markdown now has a populated section titled
// `heading` — used to detect issues already fixed in source.
const populatedWith = (records, heading) => {
  const re = new RegExp(`##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`);
  const set = new Set();
  for (const t of records) {
    const m = (t.markdown ?? "").match(re);
    const body = m ? m[1].replace(/^[-\s]+/, "").trim() : "";
    if (body.length > 20) set.add(strip(t.route));
  }
  return set;
};
const wttPopulated = populatedWith(nonlab, "When to Take Test");
const lopPopulated = populatedWith(lab, "List of Parameters");

/** A live-flagged page is resolved in source when the source now supplies it. */
function resolvedInSource(url, kind) {
  const slug = slugOf(url);
  if (kind === "blank") return !allSlugs.has(slug); // deleted or orphan → gone on deploy
  if (kind === "wtt") return wttPopulated.has(slug); // section now standardized
  if (kind === "lop") return lopPopulated.has(slug); // parameters heading standardized
  return false; // other gaps: still open unless proven otherwise
}

const open = {};
const resolved = {};
const addTo = (bucket, key, issue, name, url) => {
  const g = (bucket[key] ??= { issue, count: 0, urls: [], pages: [] });
  g.count++;
  g.urls.push(url);
  g.pages.push({ name, url });
};

// Per-section gaps (skip blank-page rows — handled below).
const live = parseCsv(readFileSync(join(OUT_DIR, "live.csv"), "utf8"));
for (const r of rows) {
  if (r.missing_sections === "(entire page is blank)") continue;
  const issue = `Missing section${r.missing_sections.includes("|") ? "s" : ""}: ${r.missing_sections.replace(/\s*\|\s*/g, ", ")}`;
  const kind = /when to take test/i.test(r.missing_sections)
    ? "wtt"
    : /list of parameters/i.test(r.missing_sections)
      ? "lop"
      : "other";
  const bucket = resolvedInSource(r.url, kind) ? resolved : open;
  addTo(bucket, slugify(issue), issue, nameFromUrl(r.url), r.url);
}

// Junk pages already deleted from source — never list them as issues.
const EXCLUDED = new Set([
  "/bangalore/lab-test/bnt",
  "/bangalore/lab-test/dsdsds",
  "/bangalore/lab-test/dummy",
  "/bangalore/lab-test/test2",
  "/blogs/test",
  "/blogs/test-route-1",
]);

// Fully-empty pages (live EMPTY severity).
for (const v of live) {
  if (v.severity !== "EMPTY") continue;
  if (EXCLUDED.has(v.path)) continue;
  const url = BASE + v.path;
  const bucket = resolvedInSource(url, "blank") ? resolved : open;
  addTo(bucket, "full-empty-page", "Full empty page (entire content blank)", nameFromUrl(url), url);
}

const groups = {
  open_issues: open,
  resolved_in_source_pending_deploy: resolved,
};

writeFileSync(
  join(OUT_DIR, "page-issues.json"),
  JSON.stringify(groups, null, 2) + "\n",
  "utf8",
);

const tally = (b) => Object.values(b).reduce((n, g) => n + g.count, 0);
console.log("Wrote data/audit/page-issues.json");
console.log(`\nOPEN issues (${tally(open)} pages):`);
for (const [k, g] of Object.entries(open)) console.log(`  ${k}: ${g.count}`);
if (!Object.keys(open).length) console.log("  (none 🎉)");
console.log(`\nRESOLVED in source, pending deploy (${tally(resolved)} pages):`);
for (const [k, g] of Object.entries(resolved)) console.log(`  ${k}: ${g.count}`);
