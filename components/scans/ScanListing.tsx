import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Home,
  ShieldCheck,
  Clock,
  HeartPulse,
  Beaker,
  Smile,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAllNonLabTestCategories,
  getNonLabTestsByCategoryId,
  getNonLabCategorySlug,
  getNonLabPriceNumber,
  getNonLabDiscountedPriceNumber,
} from "@/lib/data/nonlabtests";
import { getScanListingPage } from "@/lib/data/allpages";
import { nonLabTestUrl } from "@/lib/urls";
import {
  ScanLocalFilter,
  type ScanTestCardVM,
} from "@/components/scans/ScanLocalFilter";
import {
  ScanFamilyResults,
  type ScanFamilyNavItem,
} from "@/components/scans/ScanFamilyResults";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { FaqList } from "@/components/shared/FaqList";
import { LabStats, type LabStatItem } from "@/components/shared/LabStats";
import { TrustBadges } from "@/components/shared/TrustBadges";

interface ScanListingProps {
  familyPath: string;
  /**
   * When true, the listing is filtered client-side by keyword groups
   * (ScanLocalFilter). When false (default), it shows a sidebar linking to the
   * other scan families plus an in-page search (ScanFamilyResults). Both modes
   * render statically — search and pagination run in the browser, not via the
   * URL — so these pages are statically prerenderable.
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

/**
 * Scan/radiology stats — centre-visit procedures, so the lab-test
 * "60 Mins Home Collection" stat does not apply (§4).
 */
const SCAN_STATS: LabStatItem[] = [
  { value: 24, suffix: "h", label: "Report Turnaround", Icon: Clock },
  { value: 1, suffix: "M", label: "Happy Customers", Icon: Smile },
  { value: 4.9, label: "Google Rating", Icon: Star },
  { value: 5, label: "Certified Labs", Icon: ShieldCheck },
];

const TRUST_POINTS = [
  { Icon: ShieldCheck, label: "Certified Equipment" },
  { Icon: Clock, label: "Fast Reporting" },
  { Icon: HeartPulse, label: "Expert Radiologists" },
  { Icon: Beaker, label: "Advanced Imaging" },
] as const;

export function ScanListing({
  familyPath,
  localFilters = false,
  initialFilterKey,
}: ScanListingProps) {
  // Source the listing's own data from its route-mirrored JSON file.
  const page = getScanListingPage(familyPath);
  if (!page) notFound();
  const category = page.category;

  const basePath = `/bangalore/${familyPath}`;

  const allTests = page.tests.filter(
    (t) => t.testName && t.testName.trim().length > 0,
  );

  const scanFamilies: ScanFamilyNavItem[] = getAllNonLabTestCategories()
    .filter((c) => c.name && c.name.trim().length > 0)
    .map((c) => ({
      id: c.id,
      slug: getNonLabCategorySlug(c),
      name: c.name,
      count: getNonLabTestsByCategoryId(c.id).filter(
        (t) => t.testName && t.testName.trim().length > 0,
      ).length,
    }))
    .filter((c) => c.count > 0);

  const rawInterpretations = category.allData?.interpretations;
  const meaningfulInterpretationCols =
    rawInterpretations?.cols.filter(
      (c) => c && c.trim().length > 0 && !/^column\s*\d+$/i.test(c.trim()),
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

  // Serialisable card view-models for the client-side listing components.
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
    (f) => isMeaningfulText(f.question, 8) && isMeaningfulText(f.answer, 8),
  );
  const hasFaqs = faqs.length > 0;
  const markdownSections = splitMarkdownByH2(category.markdown ?? "");

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
            <Link href="/bangalore" className="hover:text-white transition-colors">
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
                  className="object-contain p-3"
                  sizes="360px"
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
        <LabStats stats={SCAN_STATS} />
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
          <ScanFamilyResults
            tests={cardData}
            categoryName={category.name}
            scanFamilies={scanFamilies}
            currentFamily={familyPath}
          />
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
                      {interpretations.rows
                        .filter((row) =>
                          row.some((cell) => cell && cell.trim().length > 0),
                        )
                        .map((row, ri) => (
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
