import { Meilisearch } from "meilisearch";

let client: Meilisearch | null = null;

/**
 * Browser-side Meilisearch client, constructed lazily on first use.
 *
 * Built from the SEARCH-ONLY key, which is read-only and safe to ship to the
 * browser. The admin key must NEVER appear here or in any `NEXT_PUBLIC_*`
 * variable — it lives only in `scripts/index-meili.ts` (server-side indexing).
 *
 * Construction is deferred (not at module load) because the Meilisearch
 * constructor validates the host URL and throws on an empty/invalid one. The
 * navbar renders on every page during SSR/build, so building eagerly would crash
 * any build where `NEXT_PUBLIC_MEILI_HOST` isn't set. Search only ever runs from
 * browser input, where the `NEXT_PUBLIC_*` values are inlined.
 */
export function getSearchClient(): Meilisearch {
  if (!client) {
    client = new Meilisearch({
      host: process.env.NEXT_PUBLIC_MEILI_HOST ?? "",
      apiKey: process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY ?? "",
    });
  }
  return client;
}

/**
 * Index UIDs in STRICT priority order: lab tests first, radiology scans second,
 * blogs last. The dropdown renders one group per index in exactly this order and
 * never re-sorts hits across indexes.
 *
 * If your instance uses different UIDs, change them here (and in the indexing
 * script's INDEXES list).
 */
export const SEARCH_INDEXES = [
  "cadabams_diagnostics_labtest",
  "cadabams_diagnostics_radiology",
  "cadabams_diagnostics_blogs",
] as const;

export type SearchIndexUid = (typeof SEARCH_INDEXES)[number];

/** Per-index result caps, applied to each multi-search query. */
export const SEARCH_LIMITS: Record<SearchIndexUid, number> = {
  cadabams_diagnostics_labtest: 4,
  cadabams_diagnostics_radiology: 3,
  cadabams_diagnostics_blogs: 2,
};

/** Human labels for the dropdown group headers. */
export const SEARCH_GROUP_LABELS: Record<SearchIndexUid, string> = {
  cadabams_diagnostics_labtest: "Lab Tests",
  cadabams_diagnostics_radiology: "Radiology Scans",
  cadabams_diagnostics_blogs: "Blogs",
};

/**
 * Shape of a lab-test / radiology-scan search document. Both indexes share this
 * shape; they differ only by `type` ("lab-test" vs "scan"). Fields beyond
 * id/type/url/title are optional because the source CMS data is uneven.
 */
export interface TestHit {
  id: string;
  type: "lab-test" | "scan";
  url: string;
  title: string;
  /** Short "about" summary shown under the title in the dropdown. */
  about?: string;
  category?: string;
  identifies?: string;
  measures?: string;
  aliases?: string[];
  price?: number;
  reportTime?: string;
  image?: string;
}

/** Shape of a blog search document. */
export interface BlogHit {
  id: string;
  type: "blog";
  url: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  publishedAt?: string;
  image?: string;
}

export type SearchHit = TestHit | BlogHit;
