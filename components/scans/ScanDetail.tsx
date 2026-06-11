import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  FlaskConical,
  ShieldCheck,
  Building2,
  Zap,
} from "lucide-react";
import {
  getNonLabDiscountedPriceNumber,
  getNonLabPriceNumber,
  getNonLabTestCategoryById,
} from "@/lib/data/nonlabtests";
import { getScanDetailPage } from "@/lib/data/allpages";
import { nonLabTestUrl } from "@/lib/urls";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { RelatedTestsCarousel } from "@/components/shared/RelatedTestsCarousel";
import { TestBookingActions } from "@/components/shared/TestBookingActions";
import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { BookNowButton } from "@/components/shared/BookNowButton";
import { LabStats } from "@/components/shared/LabStats";
import { CentersListCard } from "@/components/shared/CentersListCard";
import { getAllCenters, getCenterSlug } from "@/lib/data/centers";
import { isMeaningfulText as isMeaningfulShared } from "@/lib/data/meaningful";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FaqList } from "@/components/shared/FaqList";

const CITY = "bangalore";
const FALLBACK_IMAGE = "/shared/image-1727884059139-383535423.webp";

interface ScanDetailProps {
  familyPath: string;
  slug: string;
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

export function ScanDetail({ familyPath, slug }: ScanDetailProps) {
  // Source the page's own data from its route-mirrored JSON file.
  const page = getScanDetailPage(familyPath, slug);
  if (!page || !page.category) notFound();
  const test = page.test;
  const category = page.category;

  const price = getNonLabPriceNumber(test);
  const discountedPrice = getNonLabDiscountedPriceNumber(test);
  const showDiscount = discountedPrice > 0 && discountedPrice < price;
  const stated = Number(test.basic_info.discount);
  const computed = showDiscount
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;
  const discountPct = stated > 0 ? stated : computed;
  const finalPrice = discountedPrice || price;

  const heroImage =
    test.basic_info.imageSrc || category.image || FALLBACK_IMAGE;

  const relatedTests = (page.relatedTests ?? []).filter(
    (t) => t.id !== test.id && isMeaningfulShared(t.testName, 3),
  );

  const sidebarCenters = getAllCenters()
    .filter((c) => c.basic_info?.center_name?.trim().length > 0)
    .map((c) => ({
      name: c.basic_info.center_name.trim(),
      slug: getCenterSlug(c),
    }));

  const validIdentifies = isMeaningfulShared(test.basic_info.Identifies, 6)
    ? test.basic_info.Identifies.trim()
    : null;
  const validMeasures = isMeaningfulShared(test.basic_info.measures, 6)
    ? test.basic_info.measures.trim()
    : null;
  const validReportsWithin = isMeaningfulShared(
    test.basic_info.reportsWithin,
    3,
  )
    ? test.basic_info.reportsWithin.trim()
    : null;
  const validAlsoKnownAs = isMeaningfulShared(
    test.basic_info.alsoKnownAs,
    4,
  )
    ? test.basic_info.alsoKnownAs?.trim()
    : null;

  const rawInterpretations = test.interpretations;
  const meaningfulInterpretationCols =
    rawInterpretations?.cols.filter(
      (c) =>
        c && c.trim().length > 0 && !/^column\s*\d+$/i.test(c.trim()),
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

  const faqs = (test.faqs ?? []).filter(
    (f) =>
      isMeaningfulText(f.question, 8) && isMeaningfulText(f.answer, 8),
  );
  const hasFaqs = faqs.length > 0;
  const markdownSections = splitMarkdownByH2(test.markdown ?? "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: test.testName,
    description:
      test.seo?.description ||
      test.basic_info.Identifies ||
      `${test.testName} scan`,
    procedureType: category.name,
    provider: {
      "@type": "MedicalOrganization",
      name: "Cadabam's Diagnostics",
      url: "https://cadabamsdiagnostics.com",
    },
    offers: {
      "@type": "Offer",
      price: finalPrice,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `https://cadabamsdiagnostics.com${nonLabTestUrl(test)}`,
    },
  };

  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="relative overflow-hidden bg-gradient-orange-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-pill bg-orange-300/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-10 w-96 h-96 rounded-pill bg-coral-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-gutter pt-4 pb-4 sm:pt-5 sm:pb-5 lg:pt-6 lg:pb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${CITY}/${familyPath}`}>
                  {category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-xs">
                  {test.testName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4 sm:mt-5 lg:mt-6 grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[1fr_380px] items-start min-w-0">
            <div className="space-y-3 sm:space-y-4">
              <Link
                href={`/${CITY}/${familyPath}`}
                className="inline-flex items-center gap-1.5 rounded-pill bg-cream-card border border-cream-line px-3 py-1 text-overline uppercase text-orange-700 font-bold hover:border-orange-200 transition-colors"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                {category.name}
              </Link>

              <h1 className="text-h2 sm:text-h1 lg:text-display-2 font-display font-extrabold text-ink-900 leading-tight tracking-tight">
                {test.testName}
              </h1>

              {validAlsoKnownAs && (
                <p className="text-body-sm text-ink-600">
                  Also known as{" "}
                  <span className="font-semibold text-ink-800">
                    {validAlsoKnownAs}
                  </span>
                </p>
              )}

              {validIdentifies && (
                <p className="text-body lg:text-h3 text-ink-700 leading-relaxed max-w-2xl">
                  {validIdentifies}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {validReportsWithin && (
                  <span className="inline-flex items-center gap-2 bg-cream-card rounded-pill px-4 py-2 text-body-sm font-semibold text-ink-800 shadow-sh-1 border border-cream-line">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    Reports in {validReportsWithin}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 bg-cream-card rounded-pill px-4 py-2 text-body-sm font-semibold text-ink-800 shadow-sh-1 border border-cream-line">
                  <Building2 className="w-3.5 h-3.5 text-orange-600" />
                  Centre visit
                </span>
                <span className="inline-flex items-center gap-2 bg-cream-card rounded-pill px-4 py-2 text-body-sm font-semibold text-ink-800 shadow-sh-1 border border-cream-line">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  Advanced equipment
                </span>
              </div>

              <div className="flex flex-row gap-2 sm:gap-3 pt-2 max-w-xl">
                <BookNowButton
                  item={{
                    id: test.id,
                    name: test.testName,
                    price: finalPrice,
                    originalPrice: showDiscount ? price : undefined,
                    href: nonLabTestUrl(test),
                    kind: "Radiology",
                  }}
                  className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-pill bg-gradient-cta text-white font-bold px-3 sm:px-6 py-3.5 text-body-sm sm:text-body whitespace-nowrap hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  Book now · ₹{finalPrice.toLocaleString("en-IN")}
                </BookNowButton>
                <AddToCartButton
                  item={{
                    id: test.id,
                    name: test.testName,
                    price: finalPrice,
                    originalPrice: showDiscount ? price : undefined,
                    href: nonLabTestUrl(test),
                    kind: "Radiology",
                  }}
                  className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-pill bg-cream-card hover:bg-orange-50 text-ink-900 hover:text-orange-700 font-semibold px-3 sm:px-6 py-3.5 text-body-sm sm:text-body whitespace-nowrap border border-cream-line hover:border-orange-300 shadow-sh-1 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-card shadow-sh-3 border border-cream-line">
                <Image
                  src={heroImage}
                  alt={test.testName}
                  fill
                  priority
                  className="object-contain p-2 sm:p-3"
                  sizes="(max-width: 1024px) 100vw, 440px"
                />
                {(discountPct > 0 || validReportsWithin) && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/40 to-transparent"
                  />
                )}
                {discountPct > 0 && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-pill bg-coral-400 text-white text-meta font-bold px-3 py-1.5 shadow-sh-2">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    Save {discountPct}%
                  </span>
                )}
                {validReportsWithin && (
                  <div className="absolute bottom-4 right-4 bg-cream-card/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sh-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <p className="text-body-sm font-bold text-ink-900 leading-none">
                      {validReportsWithin}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-gutter pt-6 lg:pt-6">
        <LabStats />
      </div>

      <div className="mx-auto max-w-7xl px-gutter py-10 lg:py-14 grid gap-6 lg:gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          {(validIdentifies ||
            validMeasures ||
            markdownSections.length > 0 ||
            hasInterpretations) && (
            <div className="bg-cream-card rounded-sm shadow-sh-2 p-4 sm:p-6 lg:p-8 space-y-8">
              {(validIdentifies || validMeasures) && (
                <section>
                  <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                    About The Scan
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {validIdentifies && (
                      <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100">
                        <p className="text-overline uppercase text-orange-700 font-bold mb-1.5 tracking-overline">
                          Identifies
                        </p>
                        <p className="text-body-sm text-ink-700 leading-relaxed">
                          {validIdentifies}
                        </p>
                      </div>
                    )}
                    {validMeasures && (
                      <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100">
                        <p className="text-overline uppercase text-orange-700 font-bold mb-1.5 tracking-overline">
                          Measures
                        </p>
                        <p className="text-body-sm text-ink-700 leading-relaxed">
                          {validMeasures}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

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
                  <section
                    key={`md-section-${i}`}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 lg:gap-10 items-center lg:grid-cols-[1fr_1fr]">
                      <div className={imageRight ? "lg:order-1" : "lg:order-2"}>
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
                      <div className={imageRight ? "lg:order-2" : "lg:order-1"}>
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
              <FaqList items={faqs} idPrefix="scan-faq" />
            </section>
          )}

          {relatedTests.length > 0 && (
            <RelatedTestsCarousel
              title="Related Scans"
              cards={relatedTests.map((t) => {
                const p = getNonLabPriceNumber(t);
                const dp = getNonLabDiscountedPriceNumber(t);
                const tCategory = getNonLabTestCategoryById(
                  t.basic_info.categoryId,
                );
                return {
                  id: t.id,
                  kind: "Radiology",
                  name: t.testName,
                  image: t.basic_info.imageSrc ?? tCategory?.image ?? null,
                  price: dp || p,
                  originalPrice: dp > 0 && dp < p ? p : undefined,
                  reportTime: isMeaningfulShared(t.basic_info.reportsWithin, 3)
                    ? t.basic_info.reportsWithin
                    : undefined,
                  href: nonLabTestUrl(t),
                };
              })}
            />
          )}
        </div>

        <aside className="lg:col-span-1 min-w-0">
          <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line overflow-hidden">
            <div className="bg-gradient-orange-soft p-5 border-b border-cream-line">
              <p className="text-overline uppercase text-orange-700 font-bold tracking-overline">
                Book this scan
              </p>
              <h3 className="text-h3 font-bold text-ink-900 leading-snug mt-1 line-clamp-2">
                {test.testName}
              </h3>

              <div className="mt-4 flex items-baseline gap-2.5">
                <span className="text-display-2 font-display font-extrabold text-orange-600 leading-none">
                  ₹{finalPrice.toLocaleString("en-IN")}
                </span>
                {showDiscount && (
                  <span className="text-body-sm text-ink-400 line-through">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                )}
                {discountPct > 0 && (
                  <span className="ml-auto inline-flex items-center rounded-pill bg-success-bg text-success text-meta font-bold px-2.5 py-1">
                    Save {discountPct}%
                  </span>
                )}
              </div>
            </div>

            <ul className="px-5 py-4 space-y-2.5 text-body-sm text-ink-700 border-b border-cream-line">
              {validReportsWithin && (
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  Reports in {validReportsWithin}
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                Centre visit · advanced equipment
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
                Expert radiologists
              </li>
            </ul>

            <div className="p-5">
              <TestBookingActions
                testName={test.testName}
                finalPrice={finalPrice}
                testId={test.id}
                testHref={nonLabTestUrl(test)}
                originalPrice={showDiscount ? price : undefined}
                kind="Radiology"
              />
            </div>
          </div>

          <CentersListCard centers={sidebarCenters} />
          </div>
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
