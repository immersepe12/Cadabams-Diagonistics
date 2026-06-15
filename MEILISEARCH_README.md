# Search (Meilisearch)

Instant navbar search across **lab tests → radiology scans → blogs**, in that
strict priority order. One multi-index query per keystroke; results render as
labeled groups in a dropdown grafted onto the existing navbar input.

We host nothing here — the Meilisearch instance is managed elsewhere. This repo
only **wires search into the UI** and **pushes documents** into the indexes.

## How it fits together

| Piece | File |
|---|---|
| Browser search client + index priority list + hit types | `lib/meilisearch.ts` |
| Navbar search UI (debounced multi-search + dropdown) | `components/search/NavbarSearch.tsx` |
| Grafted into the navbar (desktop + mobile inputs) | `components/layout/HeaderClient.tsx` |
| Full results page (`/search`, InstantSearch) | `components/search/SearchExperience.tsx` + `app/search/page.tsx` |
| Indexing script (admin key, server-side) | `scripts/index-meili.ts` |
| Env template | `.env.local.example` |

The three indexes, in priority order, are defined once in `lib/meilisearch.ts` →
`SEARCH_INDEXES = ["cadabams_diagnostics_labtest", "cadabams_diagnostics_radiology", "cadabams_diagnostics_blogs"]`.
Search results are **never** re-sorted across indexes: every lab test ranks above
every scan, which ranks above every blog.

## Keys & environment

Copy the template and fill in real values from your Meilisearch dashboard:

```bash
cp .env.local.example .env.local
```

| Variable | Scope | Used by |
|---|---|---|
| `NEXT_PUBLIC_MEILI_HOST` | public (browser) | search client + indexer |
| `NEXT_PUBLIC_MEILI_SEARCH_KEY` | public (browser) | search client — **search-only** key |
| `MEILI_ADMIN_KEY` | **server only** | `scripts/index-meili.ts` |

**Rule:** the search-only key is the only key allowed in the browser. The admin
key must never be prefixed with `NEXT_PUBLIC_` or referenced from any client
component — it lives only in the indexing script.

> **CORS:** the browser calls Meilisearch directly with the search key, so the
> instance must allow this site's origin (Meilisearch returns
> `Access-Control-Allow-Origin: *` by default, which works out of the box).

### Confirm the index UIDs

The UIDs are `cadabams_diagnostics_labtest`, `cadabams_diagnostics_radiology`,
`cadabams_diagnostics_blogs`. Verify against your instance, and if they differ,
update `SEARCH_INDEXES` in `lib/meilisearch.ts` and `INDEX` in
`scripts/index-meili.ts`:

```bash
curl -H "Authorization: Bearer <ADMIN_KEY>" '<HOST>/indexes'
```

## Indexing

```bash
pnpm search:index
```

This runs `node --env-file=.env.local --import tsx scripts/index-meili.ts`, which:

1. Builds lean documents from the site's own data loaders (`lib/data/*.ts`) — the
   same source the pages render from, so search always matches real pages.
2. Applies each index's settings (searchable/filterable/sortable attributes,
   synonyms, stop-words).
3. Pushes the documents (primary key = the page slug).

If `NEXT_PUBLIC_MEILI_HOST` / `MEILI_ADMIN_KEY` are missing, the script prints a
**dry-run** report (document counts + a sample per index) and pushes nothing —
handy for validating the data mapping before keys are configured.

### When to re-index

Re-run `pnpm search:index` whenever indexed content changes, i.e. after the
content data in `data/allpages/_shared/*.json` is updated (for example after
`pnpm data:allpages`). New/changed/removed tests, scans, or blogs only appear in
search after a re-index.

## What gets indexed (and what doesn't)

Documents are deliberately **lean** — only high-signal fields, mapped from the
real CMS data:

- **cadabams_diagnostics_labtest / cadabams_diagnostics_radiology:** `title`,
  `about` (summary, from `seo.description`), `category`, `identifies`, `measures`,
  `price`, `reportTime`, `url` (+ `aliases` for scans, from `alsoKnownAs`).
- **cadabams_diagnostics_blogs:** `title`, `excerpt` (`seo.description`),
  `tags` (category), `publishedAt`, `url`.

Full article bodies, FAQs, and interpretation tables are **not** indexed — that
would bloat the index and hurt relevance. The full content stays on the page;
search only routes users to it.

## UI behavior

- Debounced (~200ms), one multi-search across all three indexes per keystroke.
- Dropdown shows up to three labeled groups in priority order — **top 4 lab tests,
  3 radiology scans, 2 blogs**; empty groups are hidden.
- Each row shows a type icon, the item's heading + a short "about" line; test/scan
  rows also show `₹price` when present. Each row links to the page.
- States: empty query shows nothing; loading shows a spinner; no matches shows a
  friendly message; a failed request (network/CORS/service down) shows a distinct
  "Search is unavailable" message rather than masquerading as "no results".
- Closes on outside-click and `Esc`; `↑/↓` move the highlight; `Enter` opens the
  highlighted result, or the full `/search` page when nothing is highlighted.
- A "View all results" footer links to **`/search?q=…`**, the dedicated results
  page (`SearchExperience.tsx`) — one InstantSearch box driving the same three
  indexes, with the same grouping, error and empty states.
