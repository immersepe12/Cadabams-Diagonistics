import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  type LucideIcon,
  ChevronRight,
  ChevronLeft,
  Home,
  ShieldCheck,
  Clock,
  HeartPulse,
  Beaker,
  Search,
  X,
  SlidersHorizontal,
  Activity,
  Baby,
  Bone,
  Brain,
  Layers,
  Scan,
  ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type NonLabTest,
  type NonLabTestCategory,
  getAllNonLabTestCategories,
  getNonLabTestsByCategoryId,
  getNonLabCategorySlug,
  getNonLabPriceNumber,
  getNonLabDiscountedPriceNumber,
} from "@/lib/data/nonlabtests";
import { getScanListingPage } from "@/lib/data/allpages";
import { nonLabTestUrl } from "@/lib/urls";
import { TestCard } from "@/components/shared/TestCard";
import {
  ScanLocalFilter,
  type ScanTestCardVM,
} from "@/components/scans/ScanLocalFilter";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { FaqList } from "@/components/shared/FaqList";
import { LabStats } from "@/components/shared/LabStats";
import { TrustBadges } from "@/components/shared/TrustBadges";

interface ScanListingProps {
  familyPath: string;
  searchParams?: { q?: string; page?: string };
  /**
   * When true, the listing is filtered client-side, with the active group
   * reflected in the URL path. When false (default), the sidebar links to
   * other scan families and search/pagination are URL-driven.
   */
  localFilters?: boolean;
  /** Active local-filter group from the route (e.g. .../ultrasound-scan/pregnancy). */
  initialFilterKey?: string;
}

interface MarkdownSection {
  title: string;
  body: string;
  image: { src: string; alt: string } | null;
}

const PAGE_SIZE = 18;

const MD_IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/;

function extractFirstImage(body: string): {
  body: string;
  image: { src: string; alt: string } | null;
} {
  const match = body.match(MD_IMAGE_RE);
  if (!match) return { body, image: null };
  const [full, alt, src] = match;
  const cleanedBody = body.replace(full, "").replace(/\n{3,}/g, "\n\n").trim();
  return { body: cleanedBody, image: { src, alt: alt || "" } };
}

function isMeaningfulText(s: string, minLen: number): boolean {
  const trimmed = s.trim();
  if (trimmed.length < minLen) return false;
  if (!/\s/.test(trimmed)) return false;
  const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length;
  if (vowels < 3) return false;
  return true;
}

function isPlaceholderTitle(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed.length < 4) return true;
  if (/\s/.test(trimmed)) return false;
  const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length;
  const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letters === 0) return true;
  if (vowels / letters < 0.25) return true;
  return false;
}

function splitMarkdownByH2(markdown: string): MarkdownSection[] {
  if (!markdown || markdown.trim().length === 0) return [];
  const lines = markdown.split(/\r?\n/);
  const raw: { title: string; body: string }[] = [];
  let current: { title: string; body: string } | null = null;
  const preamble: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+?)\s*$/);
    if (h2Match) {
      if (current) raw.push(current);
      current = { title: h2Match[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      preamble.push(line);
    }
  }
  if (current) raw.push(current);

  const preambleText = preamble.join("\n").trim();
  if (preambleText.length > 0) {
    const capitalized =
      preambleText.charAt(0).toUpperCase() + preambleText.slice(1);
    raw.unshift({ title: "Overview", body: capitalized });
  }

  return raw
    .map((s) => {
      const { body, image } = extractFirstImage(s.body.trim());
      return { title: s.title, body, image };
    })
    .filter((s) => {
      if (isPlaceholderTitle(s.title)) return false;
      if (s.body.length === 0 && s.image === null) return false;
      if (s.body.length > 0 && !isMeaningfulText(s.body, 20)) return false;
      return true;
    });
}

function matchesSearch(test: NonLabTest, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    test.testName.toLowerCase().includes(q) ||
    test.basic_info.name.toLowerCase().includes(q) ||
    (test.basic_info.testCategory?.toLowerCase().includes(q) ?? false)
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

function buildHref(opts: {
  basePath: string;
  page?: number;
  q?: string | null;
}): string {
  const params = new URLSearchParams();
  if (opts.q && opts.q.trim().length > 0) params.set("q", opts.q.trim());
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  const qs = params.toString();
  return qs ? `${opts.basePath}?${qs}` : opts.basePath;
}

const TRUST_POINTS = [
  { Icon: ShieldCheck, label: "Certified Equipment" },
  { Icon: Clock, label: "Fast Reporting" },
  { Icon: HeartPulse, label: "Expert Radiologists" },
  { Icon: Beaker, label: "Advanced Imaging" },
] as const;

export function ScanListing({
  familyPath,
  searchParams,
  localFilters = false,
  initialFilterKey,
}: ScanListingProps) {
  // Source the listing's own data from its route-mirrored JSON file.
  const page = getScanListingPage(familyPath);
  if (!page) notFound();
  const category = page.category;

  const basePath = `/bangalore/${familyPath}`;
  const searchQuery = (searchParams?.q ?? "").trim();
  const requestedPage = Math.max(
    1,
    parseInt(searchParams?.page || "1", 10) || 1,
  );

  const allTests = page.tests.filter(
    (t) => t.testName && t.testName.trim().length > 0,
  );
  const filteredTests = allTests.filter((t) => matchesSearch(t, searchQuery));

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredTests.length);
  const visibleTests = filteredTests.slice(startIndex, endIndex);

  const scanFamilies = getAllNonLabTestCategories()
    .filter((c) => c.name && c.name.trim().length > 0)
    .map((c) => ({
      ...c,
      slug: getNonLabCategorySlug(c),
      count: getNonLabTestsByCategoryId(c.id).filter(
        (t) => t.testName && t.testName.trim().length > 0,
      ).length,
    }))
    .filter((c) => c.count > 0);

  const rawInterpretations = category.allData?.interpretations;
  const meaningfulInterpretationCols =
    rawInterpretations?.cols.filter(
      (c) =>
        c &&
        c.trim().length > 0 &&
        !/^column\s*\d+$/i.test(c.trim()),
    ) ?? [];
  const meaningfulInterpretationRows =
    rawInterpretations?.rows.filter((row) =>
      row.some((cell) => isMeaningfulText(cell, 8)),
    ) ?? [];
  const interpretations =
    rawInterpretations &&
    meaningfulInterpretationCols.length > 0 &&
    meaningfulInterpretationRows.length > 0
      ? rawInterpretations
      : undefined;
  const hasInterpretations =
    !!interpretations?.rows && interpretations.rows.length > 0;

  // Serialisable card view-models for the client-side local filter mode.
  const cardData: ScanTestCardVM[] = allTests.map((test) => {
    const price = getNonLabPriceNumber(test);
    const discounted = getNonLabDiscountedPriceNumber(test);
    return {
      id: test.id,
      name: test.testName,
      image: test.basic_info.imageSrc ?? category.image ?? null,
      price: discounted || price,
      originalPrice: discounted > 0 && discounted < price ? price : undefined,
      reportTime: isMeaningfulText(test.basic_info.reportsWithin, 3)
        ? test.basic_info.reportsWithin
        : undefined,
      href: nonLabTestUrl(test),
    };
  });

  const faqs = (category.allData?.faqs ?? []).filter(
    (f) =>
      isMeaningfulText(f.question, 8) && isMeaningfulText(f.answer, 8),
  );
  const hasFaqs = faqs.length > 0;
  const markdownSections = splitMarkdownByH2(category.markdown ?? "");
  const hasActiveFilters = searchQuery.length > 0;

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

        <div className="relative mx-auto max-w-7xl px-gutter pt-4 pb-8 sm:pt-5 sm:pb-10 lg:pt-6 lg:pb-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-meta text-white/80 mb-4"
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
            <span className="text-white font-semibold">{category.name}</span>
          </nav>

          <div className="grid gap-5 lg:gap-8 lg:grid-cols-[1fr_320px] items-center">
            <div className="max-w-3xl">
              <p className="text-overline uppercase text-white/80 font-bold mb-2 tracking-overline">
                {category.name} in Bangalore
              </p>
              <h1 className="text-h1 sm:text-display-2 lg:text-[44px] lg:leading-[1.05] font-display font-extrabold mb-3 tracking-tight">
                {category.name} Scans
              </h1>
              <p className="text-body-sm sm:text-body lg:text-h3 text-white/90 max-w-2xl leading-relaxed">
                {allTests.length}+ {category.name.toLowerCase()} scans in
                Bangalore. Fast reports, certified equipment, trusted by
                10,000+ patients.
              </p>
            </div>

            {category.image && (
              <div className="hidden lg:block relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sh-3 border border-white/20">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="360px"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative -mt-6 lg:-mt-8 mx-auto max-w-7xl px-gutter">
        <TrustBadges
          items={TRUST_POINTS.map(({ Icon, label }) => ({
            icon: <Icon className="w-5 h-5" />,
            label,
          }))}
        />
      </section>

      <div className="mx-auto max-w-7xl px-gutter pt-6 lg:pt-8">
        <LabStats />
      </div>

      <section
        id="scans"
        className="mx-auto max-w-7xl px-gutter py-8 lg:py-10 scroll-mt-18"
      >
        {localFilters ? (
          <ScanLocalFilter
            tests={cardData}
            familyName={category.name}
            basePath={basePath}
            initialFilterKey={initialFilterKey}
          />
        ) : (
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
            <FilterSidebar
              scanFamilies={scanFamilies}
              currentFamily={familyPath}
              basePath={basePath}
              searchQuery={searchQuery}
            />

            <div className="min-w-0">
              <ResultsHeader
                startIndex={startIndex}
                endIndex={endIndex}
                totalCount={filteredTests.length}
                category={category}
                searchQuery={searchQuery}
                hasActiveFilters={hasActiveFilters}
                basePath={basePath}
              />

              {filteredTests.length === 0 ? (
                <EmptyState
                  searchQuery={searchQuery}
                  hasActiveFilters={hasActiveFilters}
                  basePath={basePath}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                    {visibleTests.map((test) => {
                      const price = getNonLabPriceNumber(test);
                      const discounted = getNonLabDiscountedPriceNumber(test);
                      return (
                        <TestCard
                          key={test.id}
                          id={test.id}
                          kind="Radiology"
                          name={test.testName}
                          image={
                            test.basic_info.imageSrc ?? category.image ?? null
                          }
                          price={discounted || price}
                          originalPrice={
                            discounted > 0 && discounted < price
                              ? price
                              : undefined
                          }
                          reportTime={isMeaningfulText(test.basic_info.reportsWithin, 3) ? test.basic_info.reportsWithin : undefined}
                          href={nonLabTestUrl(test)}
                        />
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath={basePath}
                      searchQuery={searchQuery}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-gutter pb-10 lg:pb-12 space-y-5">
        {(markdownSections.length > 0 || hasInterpretations) && (
          <div className="bg-cream-card rounded-sm shadow-sh-2 p-4 sm:p-6 lg:p-8 space-y-8">
            {markdownSections.map((section, i) => {
              const imageRight = i % 2 === 1;
              if (!section.image) {
                return (
                  <section key={`md-section-${i}`}>
                    <h2 className="text-h2 font-display font-bold text-ink-900 mb-4">
                      {section.title}
                    </h2>
                    <MarkdownContent content={section.body} />
                  </section>
                );
              }
              return (
                <section key={`md-section-${i}`} className="overflow-hidden">
                  <div
                    className={cn(
                      "grid gap-6 lg:gap-10 items-center",
                      "lg:grid-cols-[1fr_1fr]",
                    )}
                  >
                    <div className={cn(imageRight ? "lg:order-1" : "lg:order-2")}>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-soft border border-cream-line shadow-sh-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={section.image.src}
                          alt={section.image.alt || section.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className={cn(imageRight ? "lg:order-2" : "lg:order-1")}>
                      <h2 className="text-h2 font-display font-bold text-ink-900 mb-3">
                        {section.title}
                      </h2>
                      <MarkdownContent content={section.body} />
                    </div>
                  </div>
                </section>
              );
            })}

            {hasInterpretations && (
              <section>
                <h2 className="text-h2 font-display font-bold text-ink-900 mb-4">
                  Test Results
                </h2>
                {interpretations.title && (
                  <p className="text-body-sm text-ink-600 mb-4">
                    {interpretations.title}
                  </p>
                )}
                <div className="overflow-x-auto rounded-md border border-cream-line">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cream-soft">
                        {interpretations.cols
                          .filter((c) => c && c.trim().length > 0)
                          .map((c, i) => (
                            <th
                              key={i}
                              className="text-left text-body-sm font-semibold text-ink-900 px-4 py-3 border-b border-cream-line"
                            >
                              {c.trim()}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {interpretations.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          className="border-b border-cream-line last:border-b-0"
                        >
                          {row
                            .filter(
                              (_, ci) =>
                                interpretations.cols[ci] &&
                                interpretations.cols[ci].trim().length > 0,
                            )
                            .map((cell, ci) => (
                              <td
                                key={ci}
                                className="px-4 py-3 text-body-sm text-ink-700 align-top"
                              >
                                {cell.trim()}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}

        {hasFaqs && (
          <section className="bg-cream-card rounded-sm shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
            <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
              FAQs
            </h2>
            <FaqList items={faqs} idPrefix={`${familyPath}-faq`} />
          </section>
        )}
      </div>
    </main>
  );
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

function FilterSidebar({
  scanFamilies,
  currentFamily,
  basePath,
  searchQuery,
}: {
  scanFamilies: Array<NonLabTestCategory & { slug: string; count: number }>;
  currentFamily: string;
  basePath: string;
  searchQuery: string;
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start min-w-0">
      <div className="bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 p-4 lg:p-5">
        <form action={basePath} method="get">
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
              name="q"
              defaultValue={searchQuery}
              placeholder="Search scans…"
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

function ResultsHeader({
  startIndex,
  endIndex,
  totalCount,
  category,
  searchQuery,
  hasActiveFilters,
  basePath,
}: {
  startIndex: number;
  endIndex: number;
  totalCount: number;
  category: NonLabTestCategory;
  searchQuery: string;
  hasActiveFilters: boolean;
  basePath: string;
}) {
  return (
    <div className="mb-5 lg:mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <div>
          <h2 className="text-h2 lg:text-h1 font-display font-extrabold text-ink-900 tracking-tight">
            {category.name} Scans
          </h2>
          {totalCount > 0 ? (
            <p className="text-body-sm text-ink-500 mt-1">
              Showing{" "}
              <span className="font-semibold text-ink-900">
                {startIndex + 1}–{endIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-ink-900">{totalCount}</span>{" "}
              {totalCount === 1 ? "scan" : "scans"}
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
          {searchQuery.length > 0 && (
            <FilterChip
              label={`"${searchQuery}"`}
              removeHref={buildHref({ basePath, q: null, page: 1 })}
            />
          )}
          <Link
            href={basePath}
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

function EmptyState({
  searchQuery,
  hasActiveFilters,
  basePath,
}: {
  searchQuery: string;
  hasActiveFilters: boolean;
  basePath: string;
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
      {hasActiveFilters && (
        <Link
          href={basePath}
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
  basePath,
  searchQuery,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
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
    buildHref({ basePath, q: searchQuery, page });

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 lg:mt-10 flex items-center justify-center gap-2"
    >
      {isFirst ? (
        <span className={cn(navItem, disabled)} aria-disabled="true">
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Prev</span>
        </span>
      ) : (
        <Link
          href={linkFor(prevPage)}
          rel="prev"
          aria-label="Previous page"
          className={cn(navItem, idle)}
        >
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Prev</span>
        </Link>
      )}

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
      </div>

      {isLast ? (
        <span className={cn(navItem, disabled)} aria-disabled="true">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 sm:ml-1" />
        </span>
      ) : (
        <Link
          href={linkFor(nextPage)}
          rel="next"
          aria-label="Next page"
          className={cn(navItem, idle)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 sm:ml-1" />
        </Link>
      )}
    </nav>
  );
}
