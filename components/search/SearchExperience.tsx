"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Configure,
  Index,
  InstantSearch,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import {
  Search,
  X,
  FlaskConical,
  Activity,
  BookOpen,
  ChevronRight,
  SearchX,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { SEARCH_INDEXES } from "@/lib/meilisearch";
import { cn } from "@/lib/utils";

type HitType = "lab-test" | "scan" | "blog";

interface TestDoc {
  url: string;
  title: string;
  about?: string;
  category?: string;
  price?: number;
}

interface BlogDoc {
  url: string;
  title: string;
  excerpt?: string;
}

const HOST = process.env.NEXT_PUBLIC_MEILI_HOST;
const SEARCH_KEY = process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY;

/** Leading-icon treatment per result type — shared with the navbar dropdown. */
const TYPE_ICON: Record<HitType, { Icon: LucideIcon; className: string }> = {
  "lab-test": { Icon: FlaskConical, className: "bg-orange-50 text-orange-600" },
  scan: { Icon: Activity, className: "bg-tint-blue text-tint-blue-fg" },
  blog: { Icon: BookOpen, className: "bg-tint-purple text-tint-purple-fg" },
};

function formatPrice(price?: number): string | null {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return null;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

/** Branded search input wired to InstantSearch via the useSearchBox hook. */
function SearchInput() {
  const { query, refine } = useSearchBox();
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        autoFocus
        placeholder="Search tests, scans, or articles…"
        aria-label="Search"
        autoComplete="off"
        className="w-full rounded-pill border border-cream-line bg-cream-card py-3.5 pl-12 pr-12 text-body text-ink-900 shadow-sh-1 transition-all duration-200 placeholder:text-ink-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
      />
      {query && (
        <button
          type="button"
          onClick={() => refine("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-cream-soft hover:text-ink-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** One result card — uniform layout so titles, prices and chevrons all line up. */
function ResultRow({
  type,
  url,
  title,
  subtitle,
  price,
}: {
  type: HitType;
  url: string;
  title: string;
  subtitle?: string;
  price?: number;
}) {
  const { Icon, className } = TYPE_ICON[type];
  const priceLabel = formatPrice(price);
  return (
    <li>
      <Link
        href={url}
        className="group flex items-start gap-4 rounded-xl border border-cream-line bg-cream-card p-4 no-underline shadow-card transition-all duration-150 hover:border-orange-200 hover:shadow-card-hover"
      >
        <span
          className={cn(
            "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg",
            className,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-3">
            <span className="min-w-0 flex-1 truncate text-body font-semibold text-ink-900 transition-colors group-hover:text-orange-600">
              {title}
            </span>
            {priceLabel && (
              <span className="flex-shrink-0 text-body font-bold text-ink-900">
                {priceLabel}
              </span>
            )}
          </span>
          {subtitle && (
            <span className="mt-1 block text-body-sm leading-relaxed text-ink-500 line-clamp-2">
              {subtitle}
            </span>
          )}
        </span>

        <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 self-center text-ink-300 transition-colors group-hover:text-orange-500" />
      </Link>
    </li>
  );
}

/** Section heading shared by every group. */
function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-h3 font-display font-bold text-ink-900">{title}</h2>
      <span className="flex-shrink-0 text-caption font-medium text-ink-400">
        {count} {count === 1 ? "result" : "results"}
      </span>
    </div>
  );
}

/** Report this section's live hit count up to the parent for the empty-state check. */
function useReportCount(
  onCount: (key: string, n: number) => void,
  key: string,
  count: number,
) {
  useEffect(() => {
    onCount(key, count);
  }, [onCount, key, count]);
}

function TestResultsSection({
  title,
  type,
  onCount,
}: {
  title: string;
  type: "lab-test" | "scan";
  onCount: (key: string, n: number) => void;
}) {
  const { items } = useHits<TestDoc>();
  useReportCount(onCount, title, items.length);
  if (items.length === 0) return null;
  return (
    <section className="mb-8">
      <SectionHeading title={title} count={items.length} />
      <ul className="space-y-2.5">
        {items.map((hit) => (
          <ResultRow
            key={hit.objectID}
            type={type}
            url={hit.url}
            title={hit.title}
            subtitle={hit.about}
            price={hit.price}
          />
        ))}
      </ul>
    </section>
  );
}

function BlogResultsSection({
  title,
  onCount,
}: {
  title: string;
  onCount: (key: string, n: number) => void;
}) {
  const { items } = useHits<BlogDoc>();
  useReportCount(onCount, title, items.length);
  if (items.length === 0) return null;
  return (
    <section className="mb-8">
      <SectionHeading title={title} count={items.length} />
      <ul className="space-y-2.5">
        {items.map((hit) => (
          <ResultRow
            key={hit.objectID}
            type="blog"
            url={hit.url}
            title={hit.title}
            subtitle={hit.excerpt}
          />
        ))}
      </ul>
    </section>
  );
}

/** Centred message used for both the "start typing" and "no results" states. */
function CenteredNotice({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-cream-line bg-cream-card/60 px-6 py-16 text-center">
      <span className="mb-1 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream-soft text-ink-400">
        {icon}
      </span>
      <p className="text-h3 font-semibold text-ink-900">{title}</p>
      <p className="max-w-sm text-body-sm text-ink-500">{body}</p>
    </div>
  );
}

/**
 * Renders the contextual notice below the results: a recoverable error if the
 * search service is unreachable, otherwise a "no results" message when a query
 * is present and nothing matched. Stays silent while loading or when there are
 * results.
 */
function StatusNotice({ total }: { total: number }) {
  const { query } = useSearchBox();
  const { status } = useInstantSearch();
  const trimmed = query.trim();

  if (status === "error") {
    return (
      <CenteredNotice
        icon={<AlertCircle className="h-6 w-6" />}
        title="Search is unavailable"
        body="We couldn't reach the search service. Please check your connection and try again."
      />
    );
  }

  if (!trimmed || total > 0 || status === "loading" || status === "stalled") {
    return null;
  }

  return (
    <CenteredNotice
      icon={<SearchX className="h-6 w-6" />}
      title={`No results for “${trimmed}”`}
      body="Check the spelling, or try a different test, scan, or condition name."
    />
  );
}

/** Body inside InstantSearch — reads the live query to switch between states. */
function SearchBody() {
  const { query } = useSearchBox();
  const trimmed = query.trim();

  const [counts, setCounts] = useState<Record<string, number>>({});
  const report = useCallback((key: string, n: number) => {
    setCounts((c) => (c[key] === n ? c : { ...c, [key]: n }));
  }, []);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (!trimmed) {
    return (
      <CenteredNotice
        icon={<Search className="h-6 w-6" />}
        title="Search Cadabam's Diagnostics"
        body="Start typing to find lab tests, radiology scans and health articles."
      />
    );
  }

  return (
    <>
      {/* Root index: lab tests (highest priority) */}
      <Configure hitsPerPage={8} />
      <TestResultsSection title="Lab Tests" type="lab-test" onCount={report} />

      <Index indexName={SEARCH_INDEXES[1]}>
        <Configure hitsPerPage={8} />
        <TestResultsSection title="Radiology Scans" type="scan" onCount={report} />
      </Index>

      <Index indexName={SEARCH_INDEXES[2]}>
        <Configure hitsPerPage={6} />
        <BlogResultsSection title="Blogs" onCount={report} />
      </Index>

      <StatusNotice total={total} />
    </>
  );
}

/**
 * Dedicated /search experience powered by React InstantSearch + Meilisearch.
 *
 * One search box drives all three indexes (the query is inherited by the child
 * indexes), rendered as stacked groups in strict priority order: lab tests →
 * radiology scans → blogs. Styling is fully custom (cream + orange design
 * system) rather than the stock InstantSearch theme so it matches the site.
 */
export function SearchExperience() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";

  const searchClient = useMemo(() => {
    if (!HOST || !SEARCH_KEY) return null;
    return instantMeiliSearch(HOST, SEARCH_KEY).searchClient;
  }, []);

  if (!searchClient) {
    return (
      <p className="text-body-sm text-ink-500">
        Search is not configured — set NEXT_PUBLIC_MEILI_HOST and
        NEXT_PUBLIC_MEILI_SEARCH_KEY.
      </p>
    );
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={SEARCH_INDEXES[0]}
      future={{ preserveSharedStateOnUnmount: true }}
      initialUiState={{ [SEARCH_INDEXES[0]]: { query: initialQuery } }}
    >
      <div className="mb-8">
        <SearchInput />
      </div>
      <SearchBody />
    </InstantSearch>
  );
}
