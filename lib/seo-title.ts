/**
 * Normalise a raw page title into a clean "[Page Name]" by removing any
 * embedded brand mention (and the separator glueing it on). The root metadata
 * template (`%s | Cadabams Diagnostics`) then appends a single, consistent
 * brand suffix — so every page renders as "[Page Name] | Cadabams Diagnostics".
 *
 * The migrated SEO titles embed the brand inconsistently — some end with
 * "| Cadabams Diagnostics", some say "at Cadabam's Diagnostics" mid-title,
 * some omit it entirely — which combined with the template produced doubled
 * ("… | Cadabams Diagnostics | Cadabams Diagnostics") and mismatched titles.
 */

// "Cadabams" / "Cadabam's" / "Cadabam's" (curly apostrophe) + "Diagnostics".
const BRAND = "cadabam['’]?s?\\s+diagnostics";
const SEP = "[|\\u2013\\u2014\\-•·:]";

const BRAND_WITH_LEADING_SEP = new RegExp(
  `\\s*(?:${SEP}|\\bat\\b|\\bby\\b)\\s*${BRAND}\\b`,
  "gi",
);
const BRAND_WITH_TRAILING_SEP = new RegExp(`\\b${BRAND}\\s*${SEP}\\s*`, "gi");
const BRAND_BARE = new RegExp(`\\b${BRAND}\\b`, "gi");

export function pageTitle(raw: string): string {
  const original = String(raw ?? "").trim();
  let s = original;
  s = s.replace(BRAND_WITH_LEADING_SEP, "");
  s = s.replace(BRAND_WITH_TRAILING_SEP, "");
  s = s.replace(BRAND_BARE, "");
  s = s
    .replace(/\s{2,}/g, " ")
    .replace(new RegExp(`^\\s*${SEP}+\\s*`), "")
    .replace(new RegExp(`\\s*${SEP}+\\s*$`), "")
    .trim();
  return s || original;
}
