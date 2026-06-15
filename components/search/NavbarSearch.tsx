"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Search,
  Loader2,
  FlaskConical,
  Activity,
  BookOpen,
  ArrowRight,
  SearchX,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import {
  getSearchClient,
  SEARCH_INDEXES,
  SEARCH_LIMITS,
  SEARCH_GROUP_LABELS,
  type SearchIndexUid,
  type SearchHit,
  type TestHit,
} from "@/lib/meilisearch";
import { cn } from "@/lib/utils";

interface Group {
  uid: SearchIndexUid;
  label: string;
  hits: SearchHit[];
}

const INPUT_CLASS =
  "w-full bg-cream-soft text-ink-900 rounded-md pl-10 pr-4 py-2.5 text-body-sm border border-transparent focus:border-orange-500 focus:bg-cream-card focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200 placeholder:text-ink-400";

function isTestHit(hit: SearchHit): hit is TestHit {
  return hit.type === "lab-test" || hit.type === "scan";
}

/** The "about" line shown under the heading: about for tests/scans, excerpt for blogs. */
function subtitleOf(hit: SearchHit): string | undefined {
  return isTestHit(hit) ? hit.about : hit.excerpt;
}

function formatPrice(price?: number): string | null {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return null;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

/** Leading-icon treatment per result type — keeps the list scannable. */
const TYPE_ICON: Record<SearchHit["type"], { Icon: LucideIcon; className: string }> = {
  "lab-test": { Icon: FlaskConical, className: "bg-orange-50 text-orange-600" },
  scan: { Icon: Activity, className: "bg-tint-blue text-tint-blue-fg" },
  blog: { Icon: BookOpen, className: "bg-tint-purple text-tint-purple-fg" },
};

/**
 * Search behaviour grafted onto the existing navbar input. Renders the same input
 * markup/styles as the original `<form>` plus a results dropdown. Used for both
 * the desktop and mobile inputs in HeaderClient.
 *
 * The search is fired from the input's change handler (debounced) rather than a
 * `useEffect`, so no state is set synchronously inside an effect body.
 */
export function NavbarSearch({
  wrapperClassName,
  inputRef,
}: {
  /** Classes applied to the root <form> (preserves the original layout). */
  wrapperClassName?: string;
  /** Optional ref forwarded to the input (used for mobile auto-focus). */
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const router = useRouter();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const formRef = useRef<HTMLFormElement>(null);
  // Monotonic request id so a slow response can't overwrite a newer one.
  const reqId = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmed = query.trim();
  const flatHits = useMemo(() => groups.flatMap((g) => g.hits), [groups]);
  const showDropdown = open && trimmed.length > 0;

  // One multi-index search (all three indexes, priority order). Called after the
  // debounce settles; results come back in SEARCH_INDEXES order (lab tests,
  // radiology scans, blogs).
  const runSearch = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    const myReq = ++reqId.current;
    void (async () => {
      try {
        const { results } = await getSearchClient().multiSearch({
          queries: SEARCH_INDEXES.map((uid) => ({
            indexUid: uid,
            q,
            limit: SEARCH_LIMITS[uid],
          })),
        });
        if (myReq !== reqId.current) return; // a newer request superseded this one
        const next: Group[] = results
          .map((r) => ({
            uid: r.indexUid as SearchIndexUid,
            label:
              SEARCH_GROUP_LABELS[r.indexUid as SearchIndexUid] ?? r.indexUid,
            hits: (r.hits as SearchHit[]) ?? [],
          }))
          .filter((g) => g.hits.length > 0);
        setError(false);
        setGroups(next);
        setActive(-1);
      } catch {
        if (myReq !== reqId.current) return;
        // Surface a recoverable error rather than masquerading as "no results"
        // (network failure, CORS, or search service down).
        setError(true);
        setGroups([]);
      } finally {
        if (myReq === reqId.current) setLoading(false);
      }
    })();
  };

  const onChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    const hasQuery = value.trim().length > 0;
    setLoading(hasQuery); // show the spinner immediately while debouncing
    if (!hasQuery) {
      setGroups([]);
      setActive(-1);
      setError(false);
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (hasQuery) {
      debounceRef.current = setTimeout(() => runSearch(value), 200);
    }
  };

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Clear any pending debounce timer on unmount.
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const go = (hit: SearchHit | undefined) => {
    if (!hit) return;
    setOpen(false);
    router.push(hit.url);
  };

  const goToSearchPage = () => {
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If the user arrowed onto a specific hit, open it; otherwise show the full
    // results on the /search page.
    if (active >= 0 && flatHits[active]) {
      go(flatHits[active]);
    } else {
      goToSearchPage();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || flatHits.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % flatHits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? flatHits.length - 1 : i - 1));
    }
  };

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={onSubmit}
      className={cn(wrapperClassName)}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search tests, scans, or articles…"
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        className={INPUT_CLASS}
      />

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 flex max-h-[min(70vh,30rem)] flex-col overflow-hidden rounded-xl border border-cream-line bg-cream-card shadow-sh-3 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1.5">
            {loading && groups.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                <p className="text-body-sm text-ink-500">Searching…</p>
              </div>
            )}

            {!loading && error && groups.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-1.5 px-6 py-10 text-center">
                <span className="mb-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-danger-bg text-danger">
                  <AlertCircle className="h-5 w-5" />
                </span>
                <p className="text-body-sm font-semibold text-ink-800">
                  Search is unavailable
                </p>
                <p className="text-caption text-ink-500">
                  Please check your connection and try again.
                </p>
              </div>
            )}

            {!loading && !error && groups.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-1.5 px-6 py-10 text-center">
                <span className="mb-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream-soft text-ink-400">
                  <SearchX className="h-5 w-5" />
                </span>
                <p className="text-body-sm font-semibold text-ink-800">
                  No results for “{trimmed}”
                </p>
                <p className="text-caption text-ink-500">
                  Try a test, scan, or condition name.
                </p>
              </div>
            )}

            {groups.map((group, gi) => {
              // Flat offset of this group within the keyboard-navigable list.
              const offset = groups
                .slice(0, gi)
                .reduce((n, g) => n + g.hits.length, 0);
              return (
                <div
                  key={group.uid}
                  className={cn(gi > 0 && "mt-1 border-t border-cream-line/70 pt-1")}
                >
                  <div className="flex items-center justify-between px-4 pb-1 pt-2">
                    <span className="text-overline uppercase tracking-overline text-ink-400">
                      {group.label}
                    </span>
                    <span className="text-caption font-medium text-ink-300">
                      {group.hits.length}
                    </span>
                  </div>
                  {group.hits.map((hit, hi) => {
                    const isActive = offset + hi === active;
                    const price = isTestHit(hit) ? formatPrice(hit.price) : null;
                    const subtitle = subtitleOf(hit);
                    const { Icon, className: iconClass } = TYPE_ICON[hit.type];
                    return (
                      <Link
                        key={`${group.uid}:${hit.id}`}
                        href={hit.url}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group mx-1.5 flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-150",
                          isActive ? "bg-orange-50" : "hover:bg-orange-50",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                            iconClass,
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block truncate text-body-sm font-semibold transition-colors",
                              isActive
                                ? "text-orange-600"
                                : "text-ink-900 group-hover:text-orange-600",
                            )}
                          >
                            {hit.title}
                          </span>
                          {subtitle && (
                            <span className="block truncate text-caption text-ink-500">
                              {subtitle}
                            </span>
                          )}
                        </span>
                        {price && (
                          <span className="flex-shrink-0 text-body-sm font-bold text-ink-900">
                            {price}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {groups.length > 0 && (
            <Link
              href={`/search?q=${encodeURIComponent(trimmed)}`}
              onClick={() => setOpen(false)}
              className="flex flex-shrink-0 items-center justify-between gap-2 border-t border-cream-line bg-cream-card px-4 py-3 text-body-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
            >
              <span className="truncate">View all results for “{trimmed}”</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
