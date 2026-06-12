// Live content audit: crawls the deployed sitemap and flags pages whose
// section headings render with empty bodies (the "blank section" signature
// from the screenshot). Dependency-free (Node 20+ global fetch + regex).
//
// Output: data/audit/live.csv (resumable — re-runs skip already-fetched URLs).
// Run:  npm run audit:live
//       node scripts/audit-content-live.mjs --limit 20      (test a slice)
//       node scripts/audit-content-live.mjs --refresh       (re-fetch all)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "data", "audit");
const OUT_CSV = join(OUT_DIR, "live.csv");

const SITEMAP = "https://cadabamsdiagnostics.com/sitemap.xml";
const CONCURRENCY = 6;
const HEADING_BODY_MIN = 12; // chars of text under a heading to count as filled

// Only audit DETAIL pages (same scope as the local audit). Listing/static/
// utility pages (/cart, /blogs, /bangalore/lab-test) are excluded.
const SCAN_FAMILIES =
  "lab-test|xray-scan|ct-scan|mri-scan|ultrasound-scan|msk-scan|pregnancy-scan|preventive-health-checks";
const DETAIL_RE = new RegExp(
  `^/(?:bangalore/(?:${SCAN_FAMILIES})/[^/]+|bangalore/center/[^/]+|blogs/[^/]+)$`,
);

const args = process.argv.slice(2);
const LIMIT = (() => {
  const i = args.indexOf("--limit");
  return i >= 0 ? Number(args[i + 1]) : Infinity;
})();
const REFRESH = args.includes("--refresh");

// --- helpers --------------------------------------------------------------
const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function stripTags(html) {
  return html
    .replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&rsquo;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function extractMain(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i);
  if (main) return main[0];
  const body = html.match(/<body[\s\S]*?<\/body>/i);
  return body ? body[0] : html;
}

/**
 * Detail pages (lab-test + scan) render each section as:
 *   <h2 class="…sectionTitle…">About The Test</h2>
 *   <div class="…sectionContent…"> …body (may itself contain <h2> blocks)… </div>
 * So the ONLY real section markers are h2s carrying a `sectionTitle` class; a
 * section's content is everything up to the next sectionTitle h2 (the nested
 * body h2s must NOT be treated as section boundaries). A section is "empty"
 * when that content has no meaningful text.
 *
 * Returns { sectionBased, total, empty:[titles], filled, mainTextLen }.
 */
const SECTION_TITLE_RE =
  /<h2 class="[^"]*sectionTitle[^"]*"[^>]*>([\s\S]*?)<\/h2>/gi;

function analyzeHtml(html) {
  const main = extractMain(html).replace(
    /<(script|style|svg|noscript)[\s\S]*?<\/\1>/gi,
    " ",
  );
  const secs = [];
  let m;
  SECTION_TITLE_RE.lastIndex = 0;
  while ((m = SECTION_TITLE_RE.exec(main)) !== null) {
    secs.push({
      title: stripTags(m[1]).slice(0, 70),
      start: m.index,
      end: SECTION_TITLE_RE.lastIndex,
    });
  }
  const mainTextLen = stripTags(main).length;
  if (secs.length === 0) {
    // Not a fixed-section template (blog / center / other) — not analyzed here.
    return { sectionBased: false, total: 0, empty: [], filled: 0, mainTextLen };
  }
  const empty = [];
  let filled = 0;
  for (let i = 0; i < secs.length; i++) {
    const bodyHtml = main.slice(
      secs[i].end,
      i + 1 < secs.length ? secs[i + 1].start : main.length,
    );
    if (stripTags(bodyHtml).length < HEADING_BODY_MIN) empty.push(secs[i].title);
    else filled++;
  }
  return { sectionBased: true, total: secs.length, empty, filled, mainTextLen };
}

function classify({ sectionBased, total, empty, filled, mainTextLen }) {
  if (!sectionBased) return mainTextLen < 200 ? "EMPTY" : "OK"; // blog/center
  if (total === 0) return "UNKNOWN";
  if (filled === 0) return "EMPTY"; // every section is blank (the screenshot)
  if (empty.length > 0) return "THIN";
  return "OK";
}

async function fetchWithRetry(url, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "cadabams-content-audit/1.0" },
        redirect: "follow",
      });
      const html = await res.text();
      return { status: res.status, html };
    } catch (err) {
      if (i === tries - 1) return { status: 0, html: "", error: String(err) };
    }
  }
}

function urlPath(u) {
  try {
    return new URL(u).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return u;
  }
}

// --- load sitemap ---------------------------------------------------------
async function loadSitemapUrls() {
  const res = await fetch(SITEMAP, {
    headers: { "User-Agent": "cadabams-content-audit/1.0" },
  });
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(
    (m) => m[1],
  );
  return [...new Set(urls)];
}

// --- resumable result store ----------------------------------------------
function loadExisting() {
  const map = new Map();
  if (!existsSync(OUT_CSV) || REFRESH) return map;
  const lines = readFileSync(OUT_CSV, "utf8").split(/\r?\n/).slice(1);
  for (const line of lines) {
    if (!line.trim()) continue;
    const url = line.split(",")[0].replace(/^"|"$/g, "");
    map.set(url, line);
  }
  return map;
}

function flush(rows) {
  const header =
    "path,status,severity,headings_total,empty_count,empty_sections,full_url";
  const body = rows
    .map((r) =>
      typeof r === "string"
        ? r
        : [
            r.path,
            r.status,
            r.severity,
            r.total,
            r.empty.length,
            r.empty.join("|"),
            r.url,
          ]
            .map(csvCell)
            .join(","),
    )
    .join("\n");
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_CSV, `${header}\n${body}\n`, "utf8");
}

// --- main -----------------------------------------------------------------
async function main() {
  console.log("Fetching sitemap…");
  const allUrls = await loadSitemapUrls();
  const urls = allUrls.filter((u) => DETAIL_RE.test(urlPath(u)));
  console.log(
    `Sitemap has ${allUrls.length} URLs; ${urls.length} are detail pages (audited)`,
  );

  const existing = loadExisting();
  const results = new Map(existing); // url(full) -> row string
  // existing rows are keyed by path; rebuild a path set for skip logic
  const donePaths = new Set();
  for (const line of existing.values()) {
    donePaths.add(line.split(",")[0].replace(/^"|"$/g, ""));
  }

  let todo = urls.filter((u) => !donePaths.has(urlPath(u)));
  if (Number.isFinite(LIMIT)) todo = todo.slice(0, LIMIT);
  console.log(
    `${donePaths.size} already done, fetching ${todo.length} now (concurrency ${CONCURRENCY})…\n`,
  );

  const collected = []; // new row objects
  let done = 0;
  let idx = 0;

  async function worker() {
    while (idx < todo.length) {
      const url = todo[idx++];
      const path = urlPath(url);
      const { status, html } = await fetchWithRetry(url);
      let row;
      if (status !== 200) {
        row = { path, url, status, severity: "ERROR", total: 0, empty: [] };
      } else {
        const a = analyzeHtml(html);
        row = {
          path,
          url,
          status,
          severity: classify(a),
          total: a.total,
          empty: a.empty,
        };
      }
      collected.push(row);
      results.set(path, row);
      done++;
      if (done % 25 === 0) {
        flush([...results.values()]);
        process.stdout.write(`  …${done}/${todo.length}\r`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, todo.length) }, worker),
  );
  flush([...results.values()]);

  // --- summary ------------------------------------------------------------
  const all = collected;
  const by = (sev) => all.filter((r) => r.severity === sev);
  console.log(`\n\nLive audit — fetched ${all.length} pages this run\n`);
  for (const sev of ["EMPTY", "THIN", "OK", "UNKNOWN", "ERROR"]) {
    console.log(`  ${sev.padEnd(8)} ${by(sev).length}`);
  }
  const worst = by("EMPTY").concat(by("THIN"));
  console.log(`\nWorst pages (EMPTY / THIN): ${worst.length}`);
  for (const r of worst.slice(0, 30)) {
    console.log(
      `  [${r.severity}] ${r.path}${r.empty.length ? "  ← empty: " + r.empty.slice(0, 4).join(", ") : ""}`,
    );
  }
  if (worst.length > 30) console.log(`  ... and ${worst.length - 30} more`);
  console.log(`\nFull results: data/audit/live.csv\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
