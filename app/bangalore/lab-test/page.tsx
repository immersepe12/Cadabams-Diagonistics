import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Home,
  ShieldCheck,
  Clock,
  Beaker,
  HeartPulse,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type LabTest,
  type LabTestCategory,
  getAllLabTestCategories,
  getAllLabTests,
  getCategorySlug,
  getDiscountedPriceNumber,
  getLabTestCategoryById,
  getLabTestCategoryBySlug,
  getLabTestsByCategoryId,
  getPriceNumber,
} from "@/lib/data/labtests";
import { labTestUrl } from "@/lib/urls";
import { TestCard } from "@/components/shared/TestCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Lab Tests in Bangalore",
  description:
    "Book lab tests in Bangalore at best prices. Complete Blood Count, Thyroid, Diabetes, Liver Function, Lipid Profile and more — with home sample collection.",
  alternates: {
    canonical: "https://cadabamsdiagnostics.com/bangalore/lab-test",
  },
  openGraph: {
    title: "Lab Tests in Bangalore | Cadabams Diagnostics",
    description:
      "Book lab tests in Bangalore at best prices with home sample collection.",
    url: "/bangalore/lab-test",
    type: "website",
  },
};

const PAGE_SIZE = 18;
const PAGE_PATH = "/bangalore/lab-test";

const TRUST_POINTS = [
  { Icon: ShieldCheck, label: "NABL Accredited Labs" },
  { Icon: Clock, label: "Reports in 6 hours" },
  { Icon: HeartPulse, label: "Free Home Collection" },
  { Icon: Beaker, label: "1500+ Tests Available" },
] as const;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    q?: string;
  }>;
}

function buildHref(opts: {
  category?: string | null;
  page?: number;
  q?: string | null;
}): string {
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  if (opts.q && opts.q.trim().length > 0) params.set("q", opts.q.trim());
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  const qs = params.toString();
  return qs ? `${PAGE_PATH}?${qs}` : PAGE_PATH;
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

function matchesSearch(test: LabTest, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    test.testName.toLowerCase().includes(q) ||
    test.basic_info.name.toLowerCase().includes(q) ||
    (test.basic_info.testCategory?.toLowerCase().includes(q) ?? false)
  );
}

export default async function LabTestsListPage({ searchParams }: PageProps) {
  const {
    category: categoryParam,
    page: pageParam,
    q: qParam,
  } = await searchParams;

  const searchQuery = (qParam ?? "").trim();
  const allTests = getAllLabTests();

  const categories = getAllLabTestCategories()
    .filter((c) => c.name.trim().length > 0)
    .map((c) => ({ ...c, count: getLabTestsByCategoryId(c.id).length }))
    .filter((c) => c.count > 0);

  const activeCategory: LabTestCategory | undefined = categoryParam
    ? getLabTestCategoryBySlug(categoryParam)
    : undefined;
  const activeSlug = activeCategory ? getCategorySlug(activeCategory) : null;

  const categoryTests = activeCategory
    ? getLabTestsByCategoryId(activeCategory.id)
    : allTests;
  const filteredTests = categoryTests.filter((t) =>
    matchesSearch(t, searchQuery),
  );

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));
  const requestedPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredTests.length);
  const visibleTests = filteredTests.slice(startIndex, endIndex);

  const hasActiveFilters = Boolean(activeCategory) || searchQuery.length > 0;

  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-pill bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-pill bg-coral-400/30 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-gutter pt-5 pb-10 sm:pt-6 sm:pb-14 lg:pt-8 lg:pb-20">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-meta text-white/80 mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
            <Link
              href="/bangalore"
              className="hover:text-white transition-colors"
            >
              Bangalore
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
            <span className="text-white font-semibold">Lab tests</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-overline uppercase text-white/80 font-bold mb-3 tracking-overline">
              Lab tests in Bangalore
            </p>
            <h1 className="text-h1 sm:text-display-2 lg:text-[52px] lg:leading-[1.05] font-display font-extrabold mb-4 tracking-tight">
              Accurate lab tests at the best prices
            </h1>
            <p className="text-body-sm sm:text-body lg:text-h3 text-white/90 max-w-2xl leading-relaxed">
              {allTests.length}+ tests across blood, hormones, vitamins, liver,
              kidney, heart and more. Reports in 6 hours. Home sample collection
              available across Bangalore.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-6 lg:-mt-8 mx-auto max-w-7xl px-gutter">
        <div className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line p-4 lg:p-5 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {TRUST_POINTS.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-body-sm font-semibold text-ink-900 truncate">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-gutter py-10 lg:py-14">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            categories={categories}
            activeSlug={activeSlug}
            searchQuery={searchQuery}
            totalCount={allTests.length}
          />

          <div className="min-w-0">
            <ResultsHeader
              startIndex={startIndex}
              endIndex={endIndex}
              totalCount={filteredTests.length}
              activeCategory={activeCategory}
              activeSlug={activeSlug}
              searchQuery={searchQuery}
              hasActiveFilters={hasActiveFilters}
            />

            {filteredTests.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                hasActiveFilters={hasActiveFilters}
              />
            ) : (
              <>
                <TestsGrid tests={visibleTests} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    categorySlug={activeSlug}
                    searchQuery={searchQuery}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterSidebar({
  categories,
  activeSlug,
  searchQuery,
  totalCount,
}: {
  categories: Array<LabTestCategory & { count: number }>;
  activeSlug: string | null;
  searchQuery: string;
  totalCount: number;
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-hidden">
      <form
        action={PAGE_PATH}
        method="get"
        className="bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 p-4 lg:p-5 mb-4 lg:mb-5"
      >
        <label
          htmlFor="lab-search"
          className="block text-meta font-bold text-ink-700 uppercase tracking-overline mb-2"
        >
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            id="lab-search"
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search lab tests…"
            className="w-full bg-cream-bg text-ink-900 placeholder:text-ink-400 rounded-pill border border-cream-line pl-9 pr-3 py-2.5 text-body-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
          />
          {activeSlug && (
            <input type="hidden" name="category" value={activeSlug} />
          )}
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
              href={buildHref({ category: null, q: searchQuery, page: 1 })}
              active={activeSlug === null}
              label="All tests"
              count={totalCount}
            />
          </li>
          {categories.map((c) => {
            const slug = getCategorySlug(c);
            return (
              <li key={c.id}>
                <CategoryItem
                  href={buildHref({
                    category: slug,
                    q: searchQuery,
                    page: 1,
                  })}
                  active={activeSlug === slug}
                  label={c.name}
                  count={c.count}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

function CategoryItem({
  href,
  active,
  label,
  count,
}: {
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
      <span className="truncate">{label}</span>
      <span
        className={cn(
          "inline-flex items-center justify-center min-w-[1.75rem] h-5 px-1.5 rounded-pill text-caption font-bold flex-shrink-0",
          active
            ? "bg-orange-500 text-white"
            : "bg-cream-line text-ink-600",
        )}
      >
        {count}
      </span>
    </Link>
  );
}

function ResultsHeader({
  startIndex,
  endIndex,
  totalCount,
  activeCategory,
  activeSlug,
  searchQuery,
  hasActiveFilters,
}: {
  startIndex: number;
  endIndex: number;
  totalCount: number;
  activeCategory: LabTestCategory | undefined;
  activeSlug: string | null;
  searchQuery: string;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="mb-5 lg:mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <div>
          <h2 className="text-h2 lg:text-h1 font-display font-extrabold text-ink-900 tracking-tight">
            {activeCategory?.name ?? "All lab tests"}
          </h2>
          {totalCount > 0 ? (
            <p className="text-body-sm text-ink-500 mt-1">
              Showing{" "}
              <span className="font-semibold text-ink-900">
                {startIndex + 1}–{endIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-ink-900">{totalCount}</span>{" "}
              {totalCount === 1 ? "test" : "tests"}
            </p>
          ) : (
            <p className="text-body-sm text-ink-500 mt-1">No tests found</p>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-meta text-ink-500 font-medium">
            Active filters:
          </span>
          {searchQuery.length > 0 && (
            <FilterChip
              label={`"${searchQuery}"`}
              removeHref={buildHref({ category: activeSlug, q: null, page: 1 })}
            />
          )}
          {activeCategory && (
            <FilterChip
              label={activeCategory.name}
              removeHref={buildHref({
                category: null,
                q: searchQuery,
                page: 1,
              })}
            />
          )}
          <Link
            href={PAGE_PATH}
            className="text-meta font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 ml-1"
          >
            Clear all
          </Link>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  removeHref,
}: {
  label: string;
  removeHref: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 rounded-pill border border-orange-200 pl-3 pr-1 py-1 text-meta font-semibold">
      {label}
      <Link
        href={removeHref}
        aria-label={`Remove filter ${label}`}
        className="inline-flex items-center justify-center w-5 h-5 rounded-pill hover:bg-orange-100 transition-colors"
      >
        <X className="w-3 h-3" />
      </Link>
    </span>
  );
}

function TestsGrid({ tests }: { tests: LabTest[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {tests.map((test) => {
        const price = getPriceNumber(test);
        const discounted = getDiscountedPriceNumber(test);
        const categoryImage = getLabTestCategoryById(
          test.basic_info.categoryId,
        )?.image;
        return (
          <TestCard
            key={test.id}
            name={test.testName}
            image={test.basic_info.imageSrc || categoryImage}
            price={discounted || price}
            originalPrice={
              discounted > 0 && discounted < price ? price : undefined
            }
            reportTime={test.basic_info.reportsWithin}
            href={labTestUrl(test)}
          />
        );
      })}
    </div>
  );
}

function EmptyState({
  searchQuery,
  hasActiveFilters,
}: {
  searchQuery: string;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-cream-line bg-cream-card/60 px-6 py-16 text-center">
      <Search className="w-10 h-10 text-ink-300 mx-auto mb-3" />
      <p className="text-h3 font-bold text-ink-900 mb-1">
        {searchQuery
          ? `No tests match “${searchQuery}”`
          : "No tests in this category"}
      </p>
      <p className="text-body-sm text-ink-500 mb-5">
        Try a different search term or clear your filters.
      </p>
      {hasActiveFilters && (
        <Link
          href={PAGE_PATH}
          className="inline-flex items-center gap-1.5 rounded-pill bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 text-body-sm shadow-glow-orange transition-all"
        >
          Clear all filters
        </Link>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  categorySlug,
  searchQuery,
}: {
  currentPage: number;
  totalPages: number;
  categorySlug: string | null;
  searchQuery: string;
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
    "bg-cream-card/60 text-ink-300 border-cream-line cursor-not-allowed pointer-events-none";

  const linkFor = (page: number) =>
    buildHref({ category: categorySlug, q: searchQuery, page });

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {isFirst ? (
        <span className={cn(navItem, disabled)} aria-disabled="true">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Prev
        </span>
      ) : (
        <Link
          href={linkFor(prevPage)}
          rel="prev"
          aria-label="Previous page"
          className={cn(navItem, idle)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Prev
        </Link>
      )}

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
          <Link
            key={p}
            href={linkFor(p)}
            aria-label={`Go to page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(navItem, p === currentPage ? active : idle)}
          >
            {p}
          </Link>
        ),
      )}

      {isLast ? (
        <span className={cn(navItem, disabled)} aria-disabled="true">
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      ) : (
        <Link
          href={linkFor(nextPage)}
          rel="next"
          aria-label="Next page"
          className={cn(navItem, idle)}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      )}
    </nav>
  );
}
