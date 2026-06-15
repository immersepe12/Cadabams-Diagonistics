"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  type LucideIcon,
  Activity,
  Baby,
  Bone,
  Brain,
  ChevronLeft,
  ChevronRight,
  Layers,
  Scan,
  ScanLine,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TestCard } from "@/components/shared/TestCard";
import type { ScanTestCardVM } from "@/components/scans/ScanLocalFilter";

const PAGE_SIZE = 18;

export interface ScanFamilyNavItem {
  id: string;
  slug: string;
  name: string;
  count: number;
}

/** Icon per scan family, keyed by its slug. */
const FAMILY_ICONS: Record<string, LucideIcon> = {
  "preventive-health-checks": ShieldCheck,
  "msk-scan": Bone,
  "ultrasound-scan": Activity,
  "xray-scan": ScanLine,
  "mri-scan": Brain,
  "ct-scan": Layers,
  "pregnancy-scan": Baby,
};
const DEFAULT_FAMILY_ICON = Scan;

function buildPageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pageSet = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pageSet]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: (number | null)[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push(null);
    out.push(sorted[i]);
  }
  return out;
}

/**
 * Client-side default listing for a scan family: a sidebar that links to the
 * other scan families plus an in-page search box, with the results grid and
 * pagination driven entirely by local state (no URL `?q=`/`?page=`). This keeps
 * the page statically renderable while preserving the original search +
 * pagination behaviour.
 */
export function ScanFamilyResults({
  tests,
  categoryName,
  scanFamilies,
  currentFamily,
}: {
  tests: ScanTestCardVM[];
  categoryName: string;
  scanFamilies: ScanFamilyNavItem[];
  currentFamily: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = searchQuery.trim().toUpperCase();

  const indexed = useMemo(
    () => tests.map((t) => ({ test: t, upper: t.name.toUpperCase() })),
    [tests],
  );

  const filteredTests = useMemo(
    () =>
      indexed
        .filter((row) => !trimmedQuery || row.upper.includes(trimmedQuery))
        .map((row) => row.test),
    [indexed, trimmedQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredTests.length);
  const visibleTests = filteredTests.slice(startIndex, endIndex);
  const hasActiveFilters = trimmedQuery.length > 0;

  function clearSearch() {
    setSearchQuery("");
    setPage(1);
  }

  function goToPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-24 lg:self-start min-w-0">
        <div className="bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 p-4 lg:p-5">
          <label
            htmlFor="scan-search"
            className="block text-meta font-bold text-ink-700 uppercase tracking-overline mb-2"
          >
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
            <input
              id="scan-search"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search scans…"
              className="w-full bg-cream-bg text-ink-900 placeholder:text-ink-400 rounded-pill border border-cream-line pl-9 pr-3 py-2.5 text-body-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
            />
          </div>

          <div className="my-4 lg:my-5 border-t border-cream-line" />

          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
            <h3 className="text-meta font-bold text-ink-700 uppercase tracking-overline">
              Scan Categories
            </h3>
          </div>
          <ul className="space-y-1">
            {scanFamilies.map((c) => (
              <li key={c.id}>
                <FamilyItem
                  Icon={FAMILY_ICONS[c.slug] ?? DEFAULT_FAMILY_ICON}
                  href={`/bangalore/${c.slug}`}
                  active={c.slug === currentFamily}
                  label={c.name}
                  count={c.count}
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── Results ─────────────────────────────────────────────── */}
      <div ref={resultsRef} className="min-w-0 scroll-mt-18">
        <div className="mb-5 lg:mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
            <div>
              <h2 className="text-h2 lg:text-h1 font-display font-extrabold text-ink-900 tracking-tight">
                {categoryName} Scans
              </h2>
              {filteredTests.length > 0 ? (
                <p className="text-body-sm text-ink-500 mt-1">
                  Showing{" "}
                  <span className="font-semibold text-ink-900">
                    {startIndex + 1}–{endIndex}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-ink-900">
                    {filteredTests.length}
                  </span>{" "}
                  {filteredTests.length === 1 ? "scan" : "scans"}
                </p>
              ) : (
                <p className="text-body-sm text-ink-500 mt-1">No scans found</p>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-meta text-ink-500 font-medium">
                Active filters:
              </span>
              <FilterChip
                label={`"${searchQuery.trim()}"`}
                onRemove={clearSearch}
              />
              <button
                type="button"
                onClick={clearSearch}
                className="text-meta font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {filteredTests.length === 0 ? (
          <EmptyState searchQuery={searchQuery.trim()} onClear={clearSearch} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {visibleTests.map((test) => (
                <TestCard
                  key={test.id}
                  id={test.id}
                  kind="Radiology"
                  name={test.name}
                  image={test.image}
                  price={test.price}
                  originalPrice={test.originalPrice}
                  reportTime={test.reportTime}
                  href={test.href}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onGoToPage={goToPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FamilyItem({
  Icon,
  href,
  active,
  label,
  count,
}: {
  Icon: LucideIcon;
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-body-sm font-semibold transition-colors",
        active
          ? "bg-orange-50 text-orange-700"
          : "text-ink-700 hover:bg-cream-soft hover:text-orange-700",
      )}
    >
      <span className="flex items-center gap-2 min-w-0">
        <Icon
          className={cn(
            "w-4 h-4 flex-shrink-0",
            active ? "text-orange-600" : "text-ink-400",
          )}
        />
        <span className="truncate">{label}</span>
      </span>
      <span
        className={cn(
          "inline-flex items-center justify-center min-w-[1.75rem] h-5 px-1.5 rounded-pill text-caption font-bold flex-shrink-0",
          active ? "bg-orange-500 text-white" : "bg-cream-line text-ink-600",
        )}
      >
        {count}
      </span>
    </Link>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 rounded-pill border border-orange-200 pl-3 pr-1 py-1 text-meta font-semibold">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="inline-flex items-center justify-center w-5 h-5 rounded-pill hover:bg-orange-100 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function EmptyState({
  searchQuery,
  onClear,
}: {
  searchQuery: string;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-cream-line bg-cream-card/60 px-6 py-16 text-center">
      <Search className="w-10 h-10 text-ink-300 mx-auto mb-3" />
      <p className="text-h3 font-bold text-ink-900 mb-1">
        {searchQuery
          ? `No scans match "${searchQuery}"`
          : "No scans in this category"}
      </p>
      <p className="text-body-sm text-ink-500 mb-5">
        Try a different search term or clear your filters.
      </p>
      {searchQuery && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-pill bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 text-body-sm shadow-glow-orange transition-all"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onGoToPage,
}: {
  currentPage: number;
  totalPages: number;
  onGoToPage: (page: number) => void;
}) {
  const pages = buildPageWindow(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const navItem =
    "inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-pill border text-body-sm font-semibold transition-all";
  const idle =
    "bg-cream-card text-ink-700 border-cream-line hover:border-orange-200 hover:text-orange-700";
  const active =
    "bg-orange-500 text-white border-orange-500 shadow-glow-orange";
  const disabled =
    "bg-cream-card/60 text-ink-300 border-cream-line cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 lg:mt-10 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onGoToPage(currentPage - 1)}
        disabled={isFirst}
        aria-label="Previous page"
        className={cn(navItem, isFirst ? disabled : idle)}
      >
        <ChevronLeft className="w-4 h-4 sm:mr-1" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      <span
        className="sm:hidden inline-flex items-center justify-center h-10 px-4 rounded-pill border border-cream-line bg-cream-card text-body-sm font-semibold text-ink-700"
        aria-current="page"
      >
        {currentPage} / {totalPages}
      </span>

      <div className="hidden sm:flex items-center gap-2">
        {pages.map((p, i) =>
          p === null ? (
            <span
              key={`gap-${i}`}
              className="inline-flex items-center justify-center min-w-10 h-10 text-ink-400 select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onGoToPage(p)}
              aria-label={`Go to page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              className={cn(navItem, p === currentPage ? active : idle)}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onGoToPage(currentPage + 1)}
        disabled={isLast}
        aria-label="Next page"
        className={cn(navItem, isLast ? disabled : idle)}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4 sm:ml-1" />
      </button>
    </nav>
  );
}
