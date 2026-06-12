// Compare the local data audit (data/audit/local.csv) against the live crawl
// (data/audit/live.csv), joining on URL path, and produce a prioritized report.
//
// Output: data/audit/report.md + data/audit/report.csv
// Run: npm run audit:compare  (run audit:local and audit:live first)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "data", "audit");
const LOCAL = join(OUT_DIR, "local.csv");
const LIVE = join(OUT_DIR, "live.csv");

// --- minimal CSV parser (handles quoted fields) ---------------------------
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') inQ = false;
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c === "\r") {
      // ignore
    } else cell += c;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  const header = rows.shift();
  return rows
    .filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

if (!existsSync(LOCAL) || !existsSync(LIVE)) {
  console.error(
    "Missing local.csv or live.csv. Run `npm run audit:local` and `npm run audit:live` first.",
  );
  process.exit(1);
}

const local = parseCsv(readFileSync(LOCAL, "utf8"));
const live = parseCsv(readFileSync(LIVE, "utf8"));

const localByUrl = new Map(local.map((r) => [r.url, r]));
const liveByUrl = new Map(live.map((r) => [r.path, r]));

const typeFromPath = (p) => {
  if (p.startsWith("/blogs/")) return "blog";
  if (p.startsWith("/bangalore/center/")) return "center";
  if (p.startsWith("/bangalore/lab-test/")) return "labtest";
  return "scan";
};

const BAD = new Set(["EMPTY", "THIN", "ERROR"]);
const allPaths = new Set([...localByUrl.keys(), ...liveByUrl.keys()]);

const joined = [];
for (const path of allPaths) {
  const l = localByUrl.get(path);
  const v = liveByUrl.get(path);
  const localSev = l ? l.severity : "—";
  const liveSev = v ? v.severity : "—";
  const localBad = l && BAD.has(localSev);
  const liveBad = v && BAD.has(liveSev);

  let bucket;
  if (!l) bucket = "live_only"; // in sitemap but not generated locally (e.g. category pages)
  else if (!v) bucket = "local_only"; // generated locally, not in live sitemap
  else if (localBad && liveBad) bucket = "broken_both";
  else if (!localBad && liveBad) bucket = "broken_live_fixed_local";
  else if (localBad && !liveBad) bucket = "broken_local_only";
  else bucket = "ok_both";

  joined.push({
    path,
    type: l ? l.type : typeFromPath(path),
    bucket,
    localSev,
    liveSev,
    localCoreMissing: l ? l.core_missing : "",
    liveEmpty: v ? v.empty_sections : "",
    name: l ? l.name : "",
  });
}

// --- report.csv -----------------------------------------------------------
const csvCell = (x) => {
  const s = String(x ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const cols = [
  "path",
  "type",
  "bucket",
  "local_severity",
  "live_severity",
  "local_core_missing",
  "live_empty_sections",
  "name",
];
const order = {
  broken_both: 0,
  broken_live_fixed_local: 1,
  broken_local_only: 2,
  live_only: 3,
  local_only: 4,
  ok_both: 5,
};
joined.sort((a, b) => order[a.bucket] - order[b.bucket] || a.path.localeCompare(b.path));
writeFileSync(
  join(OUT_DIR, "report.csv"),
  cols.join(",") +
    "\n" +
    joined
      .map((r) =>
        [
          r.path,
          r.type,
          r.bucket,
          r.localSev,
          r.liveSev,
          r.localCoreMissing,
          r.liveEmpty,
          r.name,
        ]
          .map(csvCell)
          .join(","),
      )
      .join("\n") +
    "\n",
  "utf8",
);

// --- aggregate: most common empty live sections ---------------------------
const sectionCounts = new Map();
for (const v of live) {
  if (!v.empty_sections) continue;
  for (const t of v.empty_sections.split("|")) {
    const title = t.trim();
    if (!title) continue;
    sectionCounts.set(title, (sectionCounts.get(title) ?? 0) + 1);
  }
}
const topSections = [...sectionCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

// --- report.md ------------------------------------------------------------
const bucketCounts = {};
for (const r of joined) bucketCounts[r.bucket] = (bucketCounts[r.bucket] ?? 0) + 1;

const buckets = [
  ["broken_both", "Broken in BOTH (fix the data — priority 1)"],
  ["broken_live_fixed_local", "Broken live, fixed locally (will fix on next deploy)"],
  ["broken_local_only", "Broken locally, OK live (local regression)"],
  ["live_only", "Live-only URLs (in sitemap, not generated locally — incl. category/listing pages)"],
  ["local_only", "Local-only URLs (generated locally, not yet live)"],
  ["ok_both", "OK in both"],
];

const md = [];
md.push("# Content Audit Report\n");
md.push(
  `Generated by joining \`local.csv\` (${local.length} pages) and \`live.csv\` (${live.length} pages).\n`,
);
md.push("## Summary\n");
md.push("| Bucket | Count |");
md.push("|---|---|");
for (const [key, label] of buckets) {
  md.push(`| ${label} | ${bucketCounts[key] ?? 0} |`);
}
md.push(`| **Total distinct URLs** | **${joined.length}** |`);
md.push("");

md.push("## Most common empty sections (live)\n");
md.push(
  "A section repeated across many pages points to a systematic template/content gap.\n",
);
md.push("| Empty section heading | # pages |");
md.push("|---|---|");
for (const [title, n] of topSections)
  md.push(`| ${title.replace(/\|/g, " · ")} | ${n} |`);
md.push("");

function listBucket(key, label, limit = 60) {
  const items = joined.filter((r) => r.bucket === key);
  if (items.length === 0) return;
  md.push(`## ${label} — ${items.length}\n`);
  md.push("| Path | Type | Local | Live | Detail |");
  md.push("|---|---|---|---|---|");
  const cell = (s) => String(s ?? "").replace(/\|/g, " · ");
  for (const r of items.slice(0, limit)) {
    const detail =
      key === "live_only"
        ? r.liveEmpty
        : [r.localCoreMissing && `local:${r.localCoreMissing}`, r.liveEmpty && `live:${r.liveEmpty}`]
            .filter(Boolean)
            .join("  ");
    md.push(
      `| ${r.path} | ${r.type} | ${r.localSev} | ${r.liveSev} | ${cell((detail || "").slice(0, 90))} |`,
    );
  }
  if (items.length > limit)
    md.push(`\n_…and ${items.length - limit} more — see report.csv_`);
  md.push("");
}

for (const [key, label] of buckets) {
  if (key === "ok_both") continue; // skip the long OK list in markdown
  listBucket(key, label);
}

writeFileSync(join(OUT_DIR, "report.md"), md.join("\n"), "utf8");

// --- console --------------------------------------------------------------
console.log(`\nCompare complete — ${joined.length} distinct URLs\n`);
for (const [key, label] of buckets) {
  console.log(`  ${String(bucketCounts[key] ?? 0).padStart(4)}  ${label}`);
}
console.log(`\nTop empty live sections:`);
for (const [title, n] of topSections.slice(0, 8)) {
  console.log(`  ${String(n).padStart(4)}  ${title}`);
}
console.log(`\nReports: data/audit/report.md  +  data/audit/report.csv\n`);
