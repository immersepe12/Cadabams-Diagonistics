// Build a print-ready PDF report containing ONLY pages with content issues,
// driven by data/audit/page-issues.json. Prints via headless Chrome/Edge.
//
// Run: npm run audit:pdf   (run the audit + audit-issues-json.mjs first)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "data", "audit");
const HTML = join(OUT_DIR, "report.html");
const PDF = join(OUT_DIR, "report.pdf");

const ISSUES = join(OUT_DIR, "page-issues.json");
if (!existsSync(ISSUES)) {
  console.error("Missing data/audit/page-issues.json — run `node scripts/audit-issues-json.mjs` first.");
  process.exit(1);
}
const data = JSON.parse(readFileSync(ISSUES, "utf8"));
const open = data.open_issues ?? {};
const resolved = data.resolved_in_source_pending_deploy ?? {};

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const tally = (b) => Object.values(b).reduce((n, g) => n + g.count, 0);

const now = new Date();
const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const openCount = tally(open);
const resolvedCount = tally(resolved);

function groupSection(key, g, opts = {}) {
  const rows = g.pages
    .map(
      (p) => `<tr>
        <td class="name">${esc(p.name)}</td>
        <td class="url"><a href="${esc(p.url)}">${esc(p.url.replace(/^https?:\/\//, ""))}</a></td>
      </tr>`,
    )
    .join("");
  return `<h3 class="${opts.cls || ""}">${esc(g.issue)} <span class="n">— ${g.count} page${g.count > 1 ? "s" : ""}</span></h3>
    <table><thead><tr><th>Page name</th><th>URL</th></tr></thead><tbody>${rows}</tbody></table>`;
}

const openHtml =
  openCount === 0
    ? `<p class="none">No open issues — every flagged page is fixed in source. 🎉</p>`
    : Object.entries(open).map(([k, g]) => groupSection(k, g, { cls: "open" })).join("");

const resolvedHtml = Object.entries(resolved)
  .map(([k, g]) => groupSection(k, g, { cls: "resolved" }))
  .join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Content Issues — Cadabam's Diagnostics</title>
<style>
  @page { size: A4; margin: 15mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; color:#1f2430; font-size:11px; line-height:1.5; margin:0; }
  h1 { font-size:23px; margin:0 0 2px; color:#c2410c; }
  h2 { font-size:15px; margin:22px 0 4px; padding-bottom:4px; border-bottom:2px solid #f1d9c6; color:#9a3412; page-break-after:avoid; }
  h3 { font-size:12.5px; margin:16px 0 5px; color:#1f2430; page-break-after:avoid; }
  h3 .n { color:#6b7280; font-weight:500; }
  h3.open { color:#b91c1c; } h3.resolved { color:#15803d; }
  p.sub { margin:2px 0; color:#6b7280; }
  p.none { color:#15803d; font-weight:600; }
  .cards { display:flex; gap:8px; margin:14px 0 4px; }
  .card { flex:1; border:1px solid #e5e7eb; border-radius:8px; padding:8px 10px; background:#fafafa; }
  .card .big { font-size:22px; font-weight:700; }
  .card .lbl { color:#6b7280; font-size:10px; text-transform:uppercase; letter-spacing:.03em; }
  table { width:100%; border-collapse:collapse; margin:2px 0 8px; }
  th { text-align:left; background:#fafafa; border-bottom:1.5px solid #e5e7eb; padding:5px 6px; font-size:9.5px; text-transform:uppercase; letter-spacing:.03em; color:#6b7280; }
  td { padding:3px 6px; border-bottom:1px solid #f0f0f0; vertical-align:top; }
  td.name { font-weight:600; white-space:nowrap; padding-right:14px; }
  td.url { font-family:"Consolas",monospace; font-size:9.5px; word-break:break-all; }
  td.url a { color:#1d4ed8; text-decoration:none; }
  .badge { display:inline-block; padding:1px 8px; border-radius:10px; font-size:10px; font-weight:700; }
  .b-open { background:#fee2e2; color:#b91c1c; } .b-res { background:#dcfce7; color:#15803d; }
  footer { margin-top:20px; padding-top:8px; border-top:1px solid #e5e7eb; color:#9ca3af; font-size:9px; }
  .pagebreak { page-break-before: always; }
</style></head>
<body>
  <h1>Content Issues Report</h1>
  <p class="sub"><strong>Cadabam's Diagnostics</strong> — only pages with content issues are listed</p>
  <p class="sub">Generated ${dateStr}</p>

  <div class="cards">
    <div class="card"><div class="big" style="color:#b91c1c">${openCount}</div><div class="lbl">Open issues</div></div>
    <div class="card"><div class="big" style="color:#15803d">${resolvedCount}</div><div class="lbl">Fixed in source<br>(pending deploy)</div></div>
    <div class="card"><div class="big">${openCount + resolvedCount}</div><div class="lbl">Total issue pages</div></div>
  </div>

  <h2><span class="badge b-open">OPEN</span>&nbsp; Needs action</h2>
  ${openHtml}

  <h2 class="pagebreak"><span class="badge b-res">FIXED IN SOURCE</span>&nbsp; Clears on next deploy</h2>
  <p class="sub">These were broken in production but are already corrected in the source data — deploying the current branch resolves them.</p>
  ${resolvedHtml}

  <footer>
    Only pages with content issues are included (OK pages and unaffected routes are omitted). "Open" = still missing in the
    source data. "Fixed in source" = corrected locally, production updates on deploy. Regenerate with
    <code>npm run audit &amp;&amp; node scripts/audit-issues-json.mjs &amp;&amp; npm run audit:pdf</code>.
  </footer>
</body></html>`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(HTML, html, "utf8");
console.log(`Wrote ${HTML} (open: ${openCount}, fixed-in-source: ${resolvedCount})`);

const candidates = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.log("No Chrome/Edge found — open data/audit/report.html and print to PDF manually.");
  process.exit(0);
}
const fileUrl = "file:///" + HTML.replace(/\\/g, "/");
const res = spawnSync(
  browser,
  ["--headless", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${PDF}`, fileUrl],
  { stdio: "inherit" },
);
console.log(res.status === 0 && existsSync(PDF) ? `\n✅ PDF written: ${PDF}` : `\nHTML ready at ${HTML} — print manually.`);
