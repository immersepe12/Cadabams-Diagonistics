// Build the human-facing "missing sections per page" list from the live crawl
// (data/audit/live.csv), using full cadabamsdiagnostics.com URLs.
//
// Output: data/audit/missing-sections.csv + .txt
// Run: npm run audit:missing   (run audit:live first)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "data", "audit");
const BASE = "https://cadabamsdiagnostics.com";

// Junk pages already deleted from source data (live only until next deploy) —
// excluded from every report so they don't show up as issues.
const REMOVED = new Set([
  "/bangalore/lab-test/bnt",
  "/bangalore/lab-test/dsdsds",
  "/bangalore/lab-test/dummy",
  "/bangalore/lab-test/test2",
  "/blogs/test",
  "/blogs/test-route-1",
]);

function parseCsv(t) {
  const rows = [];
  let r = [],
    c = "",
    q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) {
      if (ch === '"' && t[i + 1] === '"') {
        c += '"';
        i++;
      } else if (ch === '"') q = false;
      else c += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      r.push(c);
      c = "";
    } else if (ch === "\n") {
      r.push(c);
      rows.push(r);
      r = [];
      c = "";
    } else if (ch !== "\r") c += ch;
  }
  if (c.length || r.length) {
    r.push(c);
    rows.push(r);
  }
  const h = rows.shift();
  return rows
    .filter((x) => x.length > 1)
    .map((x) => Object.fromEntries(h.map((k, i) => [k, x[i] ?? ""])));
}

const LIVE = join(OUT_DIR, "live.csv");
if (!existsSync(LIVE)) {
  console.error("Missing data/audit/live.csv — run `npm run audit:live` first.");
  process.exit(1);
}
const live = parseCsv(readFileSync(LIVE, "utf8"));

const out = [];
for (const r of live) {
  if (REMOVED.has(r.path)) continue;
  if (r.status !== "200") {
    if (r.severity === "ERROR")
      out.push({ url: BASE + r.path, missing: ["(page failed to load)"], sev: "ERROR" });
    continue;
  }
  if (!r.empty_sections) {
    // Blank page with no section markers (failed data fetch, or junk/empty page).
    if (r.severity === "EMPTY")
      out.push({
        url: BASE + r.path,
        missing: ["(entire page is blank)"],
        sev: "EMPTY",
      });
    continue;
  }
  const secs = [
    ...new Set(
      r.empty_sections
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
  if (secs.length === 0) continue;
  out.push({ url: BASE + r.path, missing: secs, sev: r.severity });
}
out.sort((a, b) => a.url.localeCompare(b.url));

const csvCell = (x) => {
  const s = String(x ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
writeFileSync(
  join(OUT_DIR, "missing-sections.csv"),
  "url,severity,missing_count,missing_sections\n" +
    out
      .map((o) =>
        [o.url, o.sev, o.missing.length, o.missing.join(" | ")]
          .map(csvCell)
          .join(","),
      )
      .join("\n") +
    "\n",
  "utf8",
);
writeFileSync(
  join(OUT_DIR, "missing-sections.txt"),
  out.map((o) => `${o.url}\n    missing: ${o.missing.join(", ")}`).join("\n\n") +
    "\n",
  "utf8",
);

// summary
const one = out.filter((o) => o.missing.length === 1);
const multi = out.filter((o) => o.missing.length >= 2);
const bySingle = {};
for (const o of one) bySingle[o.missing[0]] = (bySingle[o.missing[0]] ?? 0) + 1;

console.log(`\nPages with >=1 genuinely-empty section: ${out.length}`);
console.log(`  exactly 1 missing: ${one.length}  |  2+ missing: ${multi.length}\n`);
console.log("Single-missing breakdown:");
for (const [k, v] of Object.entries(bySingle).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(v).padStart(4)}  ${k}`);
console.log(`\nWritten: data/audit/missing-sections.csv + .txt\n`);
