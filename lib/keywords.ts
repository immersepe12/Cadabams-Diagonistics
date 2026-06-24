/**
 * Build a `keywords` meta list for a listing / category page from its primary
 * label (e.g. "MRI", "Blood Tests", "Lab Tests"). Restores the keyword tags
 * the legacy site exposes on listing/category pages.
 *
 * Used by the Next.js Metadata API (`keywords` field), which renders a single
 * `<meta name="keywords" content="...">` tag from the array.
 */
export function listingKeywords(label: string, extra: string[] = []): string[] {
  const lower = label.toLowerCase().trim();
  const withCity = lower.includes("bangalore") ? lower : `${lower} in bangalore`;
  return Array.from(
    new Set(
      [
        withCity,
        `${lower} bangalore`,
        `${lower} cost`,
        `${lower} price in bangalore`,
        `${lower} near me`,
        ...extra,
        "diagnostic centre in bangalore",
        "cadabams diagnostics",
      ]
        .map((k) => k.trim())
        .filter(Boolean),
    ),
  );
}
