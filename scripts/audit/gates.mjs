// Shared content-gate logic for the page audit.
//
// These functions are ported VERBATIM from the page components so the audit's
// verdict matches exactly what a visitor sees rendered:
//   - isMeaningfulStrict  <- lib/data/meaningful.ts (lab-test + blog FAQs)
//   - isMeaningfulLoose   <- inline copy in components/scans/ScanDetail.tsx
//                            and app/bangalore/center/[slug]/page.tsx
//   - isPlaceholderTitle  <- same two files
//   - splitMarkdownByH2   <- lab variant (simple) + scan/center variant (filtered)
//
// Keep these in sync if the page gates ever change.

/** Verbatim from lib/data/meaningful.ts */
export function isMeaningfulStrict(s, minLen = 4) {
  if (!s) return false;
  const trimmed = s.trim();
  if (trimmed.length < minLen) return false;

  const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letters < minLen) return false;
  const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length;
  if (vowels < 2) return false;
  if (vowels / letters < 0.2) return false;

  const hasSpace = /\s/.test(trimmed);
  if (!hasSpace) {
    const distinctVowels = new Set(trimmed.toLowerCase().match(/[aeiou]/g) || [])
      .size;
    const distinctConsonants = new Set(
      trimmed.toLowerCase().match(/[bcdfghjklmnpqrstvwxyz]/g) || [],
    ).size;
    if (distinctVowels < 2 || distinctConsonants < 2) return false;
    if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(trimmed)) return false;
  }
  return true;
}

/** Verbatim from the inline copy in ScanDetail.tsx / center page.tsx */
export function isMeaningfulLoose(s, minLen) {
  if (!s) return false;
  const trimmed = s.trim();
  if (trimmed.length < minLen) return false;
  if (!/\s/.test(trimmed)) return false;
  const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length;
  if (vowels < 3) return false;
  return true;
}

/** Verbatim from ScanDetail.tsx / center page.tsx */
export function isPlaceholderTitle(s) {
  const trimmed = (s ?? "").trim();
  if (trimmed.length < 4) return true;
  if (/\s/.test(trimmed)) return false;
  const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length;
  const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letters === 0) return true;
  if (vowels / letters < 0.25) return true;
  return false;
}

const MD_IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/;

/**
 * Split markdown into H2 sections and apply the page's filter.
 * mode "lab"    -> lab-test variant: keep any section with a non-empty body/title.
 * mode "scan"   -> scan variant: drop placeholder titles, require loose(body,20)
 *                  OR an inline image.
 * mode "center" -> center variant: same as scan but image-only sections dropped.
 */
export function splitMarkdownByH2(markdown, mode = "lab") {
  if (!markdown || markdown.trim().length === 0) return [];
  const lines = markdown.split(/\r?\n/);
  const raw = [];
  let current = null;
  const preamble = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+?)\s*$/);
    if (h2Match) {
      if (current) raw.push(current);
      current = { title: h2Match[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      preamble.push(line);
    }
  }
  if (current) raw.push(current);

  const preambleText = preamble.join("\n").trim();
  if (preambleText.length > 0) {
    raw.unshift({ title: "Overview", body: preambleText });
  }

  if (mode === "lab") {
    return raw
      .map((s) => ({ title: s.title, body: s.body.trim() }))
      .filter((s) => s.body.length > 0 || s.title.length > 0);
  }

  // scan / center
  return raw
    .map((s) => {
      const body = s.body.trim();
      const hasImage = MD_IMAGE_RE.test(body);
      const textBody = body.replace(MD_IMAGE_RE, "").trim();
      return { title: s.title, body: textBody, hasImage };
    })
    .filter((s) => {
      if (isPlaceholderTitle(s.title)) return false;
      if (s.body.length === 0) {
        return mode === "scan" && s.hasImage; // scans keep image-only sections
      }
      if (!isMeaningfulLoose(s.body, 20)) return false;
      return true;
    });
}

// ---- per-type analyzers --------------------------------------------------

function interpretationsHaveContent(interp, cellFn, minLen) {
  if (!interp || !Array.isArray(interp.rows) || interp.rows.length === 0)
    return false;
  const cols = (interp.cols ?? []).filter(
    (c) => c && c.trim().length > 0 && !/^column\s*\d+$/i.test(c.trim()),
  );
  if (cols.length === 0) return false;
  return interp.rows.some((row) =>
    row.some((cell) => cellFn(cell, minLen)),
  );
}

function faqsHaveContent(faqs, fn) {
  return (faqs ?? []).some((f) => fn(f.question, 8) && fn(f.answer, 8));
}

// "core" = the substantive main content a page of this type must have to be
// worth visiting. "optional" sections (results table, FAQs, team, testimonials)
// are reported but don't, by their absence alone, make a page thin.
const CORE = {
  labtest: ["about", "body"],
  // Scans don't populate Identifies/measures (no "About" block renders) — the
  // markdown body is their substantive content.
  scan: ["body"],
  center: ["body", "services"],
  blog: ["body"],
};

/**
 * Analyze one record. Returns { sections, missing, present, coreMissing, severity }.
 *   severity: "EMPTY" (no core content — main area blank, like the screenshot)
 *           | "THIN"  (some core content, but a core section is missing)
 *           | "OK"    (all core sections present)
 *   `missing` lists ALL absent sections (core + optional) for detail.
 */
export function analyzePage(record, type) {
  const bi = record.basic_info ?? {};
  let sections = {};

  if (type === "labtest") {
    const about =
      isMeaningfulStrict(bi.Identifies, 6) || isMeaningfulStrict(bi.measures, 6);
    const body = splitMarkdownByH2(record.markdown ?? "", "lab").length > 0;
    const results = interpretationsHaveContent(
      record.interpretations,
      isMeaningfulStrict,
      4,
    );
    const faqs = faqsHaveContent(record.faqs, isMeaningfulStrict);
    sections = { about, body, results, faqs };
  } else if (type === "scan") {
    const about =
      isMeaningfulStrict(bi.Identifies, 6) || isMeaningfulStrict(bi.measures, 6);
    const body = splitMarkdownByH2(record.markdown ?? "", "scan").length > 0;
    const results = interpretationsHaveContent(
      record.interpretations,
      isMeaningfulLoose,
      8,
    );
    const faqs = faqsHaveContent(record.faqs, isMeaningfulLoose);
    sections = { about, body, results, faqs };
  } else if (type === "center") {
    const body = splitMarkdownByH2(record.markdown ?? "", "center").length > 0;
    const services = (record.services ?? []).some(
      (s) => s.title && s.title.trim().length > 0,
    );
    const team = (record.team ?? []).some(
      (m) => m.name && m.name.trim().length > 0,
    );
    const testimonials = (record.testimonials ?? []).some(
      (t) => t.content && isMeaningfulLoose(t.content, 20),
    );
    const faqs = faqsHaveContent(record.faqs, isMeaningfulLoose);
    sections = { body, services, team, testimonials, faqs };
  } else if (type === "blog") {
    const md = (record.markdown ?? "").trim();
    // Blog body always renders if non-empty; flag empty or stub bodies.
    const body = md.length >= 200;
    const faqs = faqsHaveContent(record.faqs, isMeaningfulStrict);
    sections = { body, faqs };
  }

  const expected = Object.keys(sections);
  const missing = expected.filter((k) => !sections[k]);
  const present = expected.filter((k) => sections[k]);

  const core = CORE[type] ?? expected;
  const coreMissing = core.filter((k) => !sections[k]);
  const corePresent = core.filter((k) => sections[k]);

  let severity;
  if (corePresent.length === 0) severity = "EMPTY";
  else if (coreMissing.length > 0) severity = "THIN";
  else severity = "OK";

  return { sections, missing, present, coreMissing, severity };
}
