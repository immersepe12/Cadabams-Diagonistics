/**
 * Table-of-contents helpers shared by the lab-test and scan/radiology detail
 * templates.
 *
 * The content for both page types is markdown with a templated set of `##`
 * headings (e.g. "What Is the X and Why Is It Important?", "List of Parameters
 * Considered During the X", "Preparing for Your X"). Those raw headings are far
 * too long for a horizontal nav bar, so we map them onto a small, consistent
 * set of short labels — matching the legacy site's TOC ("About The Test",
 * "List of Parameters", "Why This Test", "When to Take Test", "Benefits",
 * "Preparing for test", "Test Results").
 *
 * Only the canonical, high-value sections become tabs; everything else still
 * renders on the page, it just isn't surfaced in the quick-nav. Keeping the
 * tab set small and stable is what makes the TOC look and behave consistently
 * sitewide.
 */

export interface TocItem {
  id: string;
  label: string;
}

/** Stable anchor id for the i-th markdown section. */
export function sectionAnchorId(index: number): string {
  return `section-${index}`;
}

interface CanonicalMatcher {
  label: string;
  test: (lowerTitle: string) => boolean;
}

/**
 * Ordered list of the canonical sections we surface in the TOC. The first
 * markdown heading that matches a given entry claims that label (each label is
 * used at most once per page). Matching is keyword-based so it is robust to the
 * test/scan name being embedded in the heading and to leading numbering like
 * "2. ".
 */
const CANONICAL_MATCHERS: CanonicalMatcher[] = [
  { label: "List of Parameters", test: (t) => /parameter/.test(t) },
  {
    label: "Why This Test",
    test: (t) => /why is it important|what is\b|what are\b/.test(t),
  },
  {
    label: "When to Take Test",
    test: (t) =>
      /when\b[^?]*\b(take|taken|need)/.test(t) || /best time to take/.test(t),
  },
  { label: "Benefits", test: (t) => /benefit|advantage/.test(t) },
  { label: "Preparing for Test", test: (t) => /prepar/.test(t) },
];

/** Normalise a heading for matching: strip leading "12. " numbering, lowercase. */
function normalizeHeading(title: string): string {
  return title
    .replace(/^\s*\d+[.)]\s*/, "")
    .toLowerCase()
    .trim();
}

/**
 * Map each markdown section index to its canonical TOC label (for the sections
 * we surface). Only the first heading to match a given label claims it, so the
 * mapping is 1:1 and in document order.
 *
 * Pages use this both to build the TOC tabs and to render a matching label on
 * the target section itself — so when a visitor clicks "List of Parameters"
 * they land on a section clearly marked "List of Parameters".
 */
export function getCanonicalSectionLabels(
  titles: string[],
): Map<number, string> {
  const used = new Set<string>();
  const labels = new Map<number, string>();

  titles.forEach((title, index) => {
    const normalized = normalizeHeading(title);
    for (const matcher of CANONICAL_MATCHERS) {
      if (used.has(matcher.label)) continue;
      if (matcher.test(normalized)) {
        used.add(matcher.label);
        labels.set(index, matcher.label);
        break;
      }
    }
  });

  return labels;
}

/**
 * Build the TOC tabs for the markdown sections, in document order. `titles` is
 * the ordered list of rendered section headings; the returned items reference
 * sections by their `sectionAnchorId(index)`.
 */
export function buildMarkdownToc(titles: string[]): TocItem[] {
  return [...getCanonicalSectionLabels(titles).entries()]
    .sort(([a], [b]) => a - b)
    .map(([index, label]) => ({ id: sectionAnchorId(index), label }));
}

/* ==========================================================================
   Canonical section ordering (scan / radiology pages)

   The migrated `markdown` for scan pages does not preserve the section order
   of the legacy site — most notably "Risks & Limitations" lands high up
   (right after "When/Who") when on the old site it sits near the very end.
   We restore the legacy flow by ranking each section heading and stable
   sorting by that rank.

   IMPORTANT: this ordering is for SCAN/RADIOLOGY pages only. Lab-test pages
   already match the legacy order (their "Risks or Limitations" intentionally
   sits early, right after "When"), so they must NOT use this.
   ========================================================================== */

interface RankMatcher {
  rank: number;
  test: (lowerTitle: string) => boolean;
}

// Ordered to mirror the legacy scan page flow. First match wins, so more
// specific / earlier-in-the-page categories are listed first.
const SCAN_SECTION_RANKS: RankMatcher[] = [
  { rank: 10, test: (t) => /\boverview\b/.test(t) },
  { rank: 20, test: (t) => /what is\b|what are\b|what's a\b|definition of/.test(t) },
  { rank: 30, test: (t) => /\btypes? of\b/.test(t) },
  { rank: 40, test: (t) => /parameter/.test(t) },
  {
    rank: 50,
    test: (t) => /\breasons?\b|\breasoning\b|why is it important|why this test/.test(t),
  },
  { rank: 60, test: (t) => /\bwhen\b|\bwho\b/.test(t) },
  { rank: 70, test: (t) => /benefit|advantage/.test(t) },
  {
    rank: 80,
    test: (t) =>
      /illness|disease|\bdiagnosed\b|what conditions|conditions? (can|that|are|to|in|by)/.test(
        t,
      ),
  },
  { rank: 90, test: (t) => /\bprepar/.test(t) },
  { rank: 100, test: (t) => /pre-?requisite|prerequisite|requisite/.test(t) },
  { rank: 110, test: (t) => /best time/.test(t) },
  { rank: 120, test: (t) => /eligib/.test(t) },
  { rank: 130, test: (t) => /procedure|step.?by.?step/.test(t) },
  { rank: 140, test: (t) => /caution/.test(t) },
  {
    rank: 150,
    test: (t) =>
      /\brisks?\b.*\blimitation|^risks?\b|limitations? (of|to|and)/.test(t),
  },
];

function scanSectionRank(title: string): number | null {
  const normalized = normalizeHeading(title);
  for (const matcher of SCAN_SECTION_RANKS) {
    if (matcher.test(normalized)) return matcher.rank;
  }
  return null;
}

/**
 * Reorder scan/radiology markdown sections into the legacy site's canonical
 * flow. Sections whose heading doesn't match a known category (intro taglines,
 * promo blurbs, one-off headings) inherit the rank of the section they follow,
 * so they stay glued in place rather than jumping around. The sort is stable
 * (ties break on original index) and deterministic.
 */
export function orderScanSections<T extends { title: string }>(
  sections: T[],
): T[] {
  let lastRank = Number.NEGATIVE_INFINITY;
  return sections
    .map((section, index) => {
      const rank = scanSectionRank(section.title);
      if (rank !== null) lastRank = rank;
      return { section, index, key: rank !== null ? rank : lastRank };
    })
    .sort((a, b) => a.key - b.key || a.index - b.index)
    .map((entry) => entry.section);
}
