"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Blog, BlogCategory } from "@/lib/data/blogs";
import { BlogCard } from "@/components/shared/BlogCard";

const PAGE_SIZE = 12;

type CategoryWithCount = BlogCategory & { count: number };

interface BlogsListingProps {
  allBlogs: Blog[];
  categories: CategoryWithCount[];
}

function matchesSearch(blog: Blog, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    blog.title.toLowerCase().includes(q) ||
    (blog.seo?.description?.toLowerCase().includes(q) ?? false) ||
    blog.categoryName.toLowerCase().includes(q) ||
    (blog.verifiedBy?.toLowerCase().includes(q) ?? false)
  );
}

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

export function BlogsListing({ allBlogs, categories }: BlogsListingProps) {
  // Category, search and pagination are all held in local state so the URL
  // stays a clean "/blogs" — no category ObjectId leaks into the query string.
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeId),
    [categories, activeId],
  );

  const filteredBlogs = useMemo(() => {
    const byCategory = activeId
      ? allBlogs.filter((b) => b.blogCategoryId === activeId)
      : allBlogs;
    return byCategory.filter((b) => matchesSearch(b, searchQuery));
  }, [allBlogs, activeId, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredBlogs.length);
  const visibleBlogs = filteredBlogs.slice(startIndex, endIndex);

  const hasActiveFilters = Boolean(activeCategory) || searchQuery.length > 0;
  const featured = activeCategory ? null : allBlogs[0] ?? null;

  const selectCategory = (id: string | null) => {
    setActiveId(id);
    setPage(1);
    // Bring the listing into view — on mobile the filters stack above the
    // results, so the freshly filtered blogs would otherwise be off-screen.
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const submitSearch = (value: string) => {
    setSearchQuery(value.trim());
    setPage(1);
  };
  const clearAll = () => {
    setActiveId(null);
    setSearchQuery("");
    setSearchInput("");
    setPage(1);
  };

  return (
    <>
      {featured && <FeaturedBlog blog={featured} />}

      <section className="mx-auto max-w-7xl px-gutter py-8 lg:py-10">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            categories={categories}
            activeId={activeId}
            searchInput={searchInput}
            totalCount={allBlogs.length}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={() => submitSearch(searchInput)}
            onSelectCategory={selectCategory}
          />

          <div ref={resultsRef} className="min-w-0 scroll-mt-18">
            <ResultsHeader
              startIndex={startIndex}
              endIndex={endIndex}
              totalCount={filteredBlogs.length}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              hasActiveFilters={hasActiveFilters}
              onRemoveSearch={() => submitSearch("")}
              onRemoveCategory={() => selectCategory(null)}
              onClearAll={clearAll}
            />

            {filteredBlogs.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                hasActiveFilters={hasActiveFilters}
                onClearAll={clearAll}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {visibleBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onGoToPage={setPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturedBlog({ blog }: { blog: Blog }) {
  const href = `/blogs${blog.route}`;
  const date = formatDate(blog.createdAt);
  return (
    <section className="mx-auto max-w-7xl px-gutter pt-8 lg:pt-10">
      <p className="text-overline uppercase text-orange-700 font-bold tracking-overline mb-3">
        Featured article
      </p>
      <Link
        href={href}
        className="group block bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line overflow-hidden grid lg:grid-cols-2 hover:shadow-sh-3 transition-shadow"
      >
        <div className="relative aspect-[16/10] lg:aspect-auto bg-cream-soft overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.imageUrl}
            alt={blog.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4 sm:p-6 lg:p-8 lg:p-10 flex flex-col justify-center">
          <span className="inline-flex items-center self-start rounded-pill bg-orange-50 border border-orange-100 text-orange-700 font-bold text-overline uppercase px-3 py-1 tracking-overline">
            {blog.categoryName}
          </span>
          <h2 className="mt-4 text-h2 lg:text-h1 font-display font-extrabold text-ink-900 leading-tight tracking-tight group-hover:text-orange-700 transition-colors line-clamp-3">
            {blog.title}
          </h2>
          {blog.seo?.description && (
            <p className="mt-3 text-body-sm sm:text-body lg:text-h3 text-ink-600 leading-relaxed line-clamp-3">
              {blog.seo.description}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3 text-meta text-ink-500">
            {blog.verifiedBy && (
              <span className="font-semibold text-ink-700">
                {blog.verifiedBy}
              </span>
            )}
            {date && (
              <>
                <span className="w-1 h-1 rounded-pill bg-ink-300" />
                <time dateTime={blog.createdAt}>{date}</time>
              </>
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-orange-600 font-bold group-hover:translate-x-0.5 transition-transform">
              Read article
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

function FilterSidebar({
  categories,
  activeId,
  searchInput,
  totalCount,
  onSearchInputChange,
  onSearchSubmit,
  onSelectCategory,
}: {
  categories: CategoryWithCount[];
  activeId: string | null;
  searchInput: string;
  totalCount: number;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSelectCategory: (id: string | null) => void;
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
        className="bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 p-4 lg:p-5 mb-4 lg:mb-5"
      >
        <label
          htmlFor="blog-search"
          className="block text-meta font-bold text-ink-700 uppercase tracking-overline mb-2"
        >
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            id="blog-search"
            type="search"
            name="q"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            placeholder="Search articles…"
            className="w-full bg-cream-bg text-ink-900 placeholder:text-ink-400 rounded-pill border border-cream-line pl-9 pr-3 py-2.5 text-body-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
          />
        </div>
        <button
          type="submit"
          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-pill bg-gradient-cta text-white font-semibold py-2 text-body-sm shadow-glow-soft hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
      </form>

      <div className="bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-orange-600" />
          <h3 className="text-meta font-bold text-ink-700 uppercase tracking-overline">
            Categories
          </h3>
        </div>
        <ul className="space-y-1">
          <li>
            <CategoryItem
              active={activeId === null}
              label="All articles"
              count={totalCount}
              onClick={() => onSelectCategory(null)}
            />
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <CategoryItem
                active={activeId === c.id}
                label={c.title}
                count={c.count}
                onClick={() => onSelectCategory(c.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function CategoryItem({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-body-sm font-semibold transition-colors text-left",
        active
          ? "bg-orange-50 text-orange-700"
          : "text-ink-700 hover:bg-cream-soft hover:text-orange-700",
      )}
    >
      <span className="truncate">{label}</span>
      <span
        className={cn(
          "inline-flex items-center justify-center min-w-[1.75rem] h-5 px-1.5 rounded-pill text-caption font-bold flex-shrink-0",
          active ? "bg-orange-500 text-white" : "bg-cream-line text-ink-600",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function ResultsHeader({
  startIndex,
  endIndex,
  totalCount,
  activeCategory,
  searchQuery,
  hasActiveFilters,
  onRemoveSearch,
  onRemoveCategory,
  onClearAll,
}: {
  startIndex: number;
  endIndex: number;
  totalCount: number;
  activeCategory: CategoryWithCount | undefined;
  searchQuery: string;
  hasActiveFilters: boolean;
  onRemoveSearch: () => void;
  onRemoveCategory: () => void;
  onClearAll: () => void;
}) {
  return (
    <div className="mb-5 lg:mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <div>
          <h2 className="text-h2 lg:text-h1 font-display font-extrabold text-ink-900 tracking-tight">
            {activeCategory?.title ?? "All articles"}
          </h2>
          {totalCount > 0 ? (
            <p className="text-body-sm text-ink-500 mt-1">
              Showing{" "}
              <span className="font-semibold text-ink-900">
                {startIndex + 1}–{endIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-ink-900">{totalCount}</span>{" "}
              {totalCount === 1 ? "article" : "articles"}
            </p>
          ) : (
            <p className="text-body-sm text-ink-500 mt-1">No articles found</p>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-meta text-ink-500 font-medium">
            Active filters:
          </span>
          {searchQuery.length > 0 && (
            <FilterChip label={`"${searchQuery}"`} onRemove={onRemoveSearch} />
          )}
          {activeCategory && (
            <FilterChip
              label={activeCategory.title}
              onRemove={onRemoveCategory}
            />
          )}
          <button
            type="button"
            onClick={onClearAll}
            className="text-meta font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
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
  hasActiveFilters,
  onClearAll,
}: {
  searchQuery: string;
  hasActiveFilters: boolean;
  onClearAll: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-cream-line bg-cream-card/60 px-6 py-16 text-center">
      <Search className="w-10 h-10 text-ink-300 mx-auto mb-3" />
      <p className="text-h3 font-bold text-ink-900 mb-1">
        {searchQuery
          ? `No articles match “${searchQuery}”`
          : "No articles in this category"}
      </p>
      <p className="text-body-sm text-ink-500 mb-5">
        Try a different search term or clear your filters.
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1.5 rounded-pill bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 text-body-sm shadow-glow-orange transition-all"
        >
          Clear all filters
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
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);
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
        onClick={() => onGoToPage(prevPage)}
        disabled={isFirst}
        aria-label="Previous page"
        className={cn(navItem, isFirst ? disabled : idle)}
      >
        <ChevronLeft className="w-4 h-4 sm:mr-1" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Compact current/total indicator — small screens only */}
      <span
        className="sm:hidden inline-flex items-center justify-center h-10 px-4 rounded-pill border border-cream-line bg-cream-card text-body-sm font-semibold text-ink-700"
        aria-current="page"
      >
        {currentPage} / {totalPages}
      </span>

      {/* Full numbered window — sm and up */}
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
        onClick={() => onGoToPage(nextPage)}
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

const DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return DATE_FORMATTER.format(d);
}
