import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  FlaskConical,
  ShieldCheck,
  Tag,
  Home as HomeIcon,
  Zap,
  ShoppingCart,
} from "lucide-react";
import {
  getAllLabTestSlugs,
  getDiscountedPriceNumber,
  getLabTestBySlug,
  getLabTestCategoryById,
  getLabTestsByIds,
  getPriceNumber,
} from "@/lib/data/labtests";
import { labTestUrl } from "@/lib/urls";
import { stripLeadingSlash } from "@/lib/data/types";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { TestCard } from "@/components/shared/TestCard";
import { TestBookingActions } from "@/components/shared/TestBookingActions";
import { LabStats } from "@/components/shared/LabStats";
import { CentersListCard } from "@/components/shared/CentersListCard";
import { getAllCenters, getCenterSlug } from "@/lib/data/centers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FaqList } from "@/components/shared/FaqList";

export const revalidate = 86400;

const CITY = "bangalore";
const FALLBACK_IMAGE = "/shared/image-1727884059139-383535423.webp";

interface MarkdownSection {
  title: string;
  body: string;
}

function splitMarkdownByH2(markdown: string): MarkdownSection[] {
  if (!markdown || markdown.trim().length === 0) return [];
  const lines = markdown.split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection | null = null;
  let preamble: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+?)\s*$/);
    if (h2Match) {
      if (current) sections.push(current);
      current = { title: h2Match[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      preamble.push(line);
    }
  }
  if (current) sections.push(current);

  const preambleText = preamble.join("\n").trim();
  if (preambleText.length > 0) {
    sections.unshift({ title: "Overview", body: preambleText });
  }
  return sections
    .map((s) => ({ title: s.title, body: s.body.trim() }))
    .filter((s) => s.body.length > 0 || s.title.length > 0);
}

export async function generateStaticParams() {
  return getAllLabTestSlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = getLabTestBySlug(slug);
  if (!test) return {};

  const fallbackTitle = `${test.testName} in Bangalore | Cadabam's Diagnostics`;
  const fallbackDesc =
    `Book ${test.testName} in Bangalore. ${test.basic_info.Identifies || ""}`.trim();
  const canonical =
    test.seo?.canonicalUrl ||
    `https://cadabamsdiagnostics.com${labTestUrl(test)}`;

  return {
    title: test.seo?.title || fallbackTitle,
    description: test.seo?.description || fallbackDesc,
    alternates: { canonical },
    openGraph: {
      title: test.seo?.ogTitle || test.seo?.title || fallbackTitle,
      description:
        test.seo?.ogDescription || test.seo?.description || fallbackDesc,
      images: test.seo?.ogImage ? [{ url: test.seo.ogImage }] : undefined,
      type: "article",
    },
  };
}

export default async function LabTestDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const test = getLabTestBySlug(slug);
  if (!test) notFound();

  const price = getPriceNumber(test);
  const discountedPrice = getDiscountedPriceNumber(test);
  const showDiscount = discountedPrice > 0 && discountedPrice < price;
  const stated = Number(test.basic_info.discount);
  const computed = showDiscount
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;
  const discountPct = stated > 0 ? stated : computed;
  const finalPrice = discountedPrice || price;

  const category = getLabTestCategoryById(test.basic_info.categoryId);
  const heroImage =
    test.basic_info.imageSrc || category?.image || FALLBACK_IMAGE;

  const relatedTests = test.relative_test?.tests
    ? getLabTestsByIds(test.relative_test.tests.map((t) => t.id)).filter(
        (t) => t.id !== test.id,
      )
    : [];

  const sidebarCenters = getAllCenters()
    .filter((c) => c.basic_info?.center_name?.trim().length > 0)
    .map((c) => ({
      name: c.basic_info.center_name.trim(),
      slug: getCenterSlug(c),
    }));

  const hasInterpretations =
    test.interpretations?.rows && test.interpretations.rows.length > 0;
  const hasFaqs = test.faqs && test.faqs.length > 0;
  const markdownSections = splitMarkdownByH2(test.markdown ?? "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTest",
    name: test.testName,
    description:
      test.seo?.description ||
      test.basic_info.Identifies ||
      `${test.testName} lab test`,
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
      url: `https://cadabamsdiagnostics.com${labTestUrl(test)}`,
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

        <div className="relative mx-auto max-w-7xl px-gutter pt-5 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-14">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${CITY}/lab-test`}>
                  Lab Tests
                </BreadcrumbLink>
              </BreadcrumbItem>
              {category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/${CITY}/lab-test?category=${stripLeadingSlash(category.path)}`}
                    >
                      {category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-xs">
                  {test.testName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-5 sm:mt-6 lg:mt-8 grid gap-5 sm:gap-6 lg:gap-10 lg:grid-cols-[1fr_440px] items-start min-w-0">
            <div className="space-y-4 sm:space-y-5 min-w-0">
              {category && (
                <Link
                  href={`/${CITY}/lab-test?category=${stripLeadingSlash(category.path)}`}
                  className="inline-flex items-center gap-1.5 rounded-pill bg-cream-card border border-cream-line px-3 py-1 text-overline uppercase text-orange-700 font-bold hover:border-orange-200 transition-colors max-w-full"
                >
                  <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{category.name}</span>
                </Link>
              )}

              <h1 className="text-h2 sm:text-h1 lg:text-display-1 font-display font-extrabold text-ink-900 leading-tight tracking-tight break-words">
                {test.testName}
              </h1>

              {test.basic_info.Identifies && (
                <p className="text-body-sm sm:text-body lg:text-h3 text-ink-700 leading-relaxed max-w-2xl">
                  {test.basic_info.Identifies}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {test.basic_info.reportsWithin && (
                  <span className="inline-flex items-center gap-1.5 bg-cream-card rounded-pill px-3 py-1.5 text-meta font-semibold text-ink-700 shadow-sh-1 border border-cream-line">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    Reports in {test.basic_info.reportsWithin}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 bg-cream-card rounded-pill px-3 py-1.5 text-meta font-semibold text-ink-700 shadow-sh-1 border border-cream-line">
                  <HomeIcon className="w-3.5 h-3.5 text-orange-600" />
                  Free home collection
                </span>
                <span className="inline-flex items-center gap-1.5 bg-cream-card rounded-pill px-3 py-1.5 text-meta font-semibold text-ink-700 shadow-sh-1 border border-cream-line">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  NABL Accredited
                </span>
                {test.basic_info.testId && (
                  <span className="inline-flex items-center gap-1.5 bg-cream-card rounded-pill px-3 py-1.5 text-meta font-semibold text-ink-700 shadow-sh-1 border border-cream-line">
                    <Tag className="w-3.5 h-3.5 text-orange-600" />
                    ID {test.basic_info.testId}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2 sm:pt-3">
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-5 py-2.5 sm:px-6 sm:py-3 text-body-sm sm:text-body border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 active:scale-[0.98]"
                >
                  <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                  Add to cart
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-cta text-white font-bold px-5 py-2.5 sm:px-6 sm:py-3 text-body-sm sm:text-body shadow-glow-orange ring-2 ring-orange-300/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                >
                  <Zap className="w-4 h-4 fill-white flex-shrink-0" />
                  Book now · ₹{finalPrice.toLocaleString("en-IN")}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-card shadow-sh-3 border border-cream-line">
                <Image
                  src={heroImage}
                  alt={test.testName}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 440px"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/40 to-transparent"
                />
                {discountPct > 0 && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-pill bg-coral-400 text-white text-meta font-bold px-3 py-1.5 shadow-sh-2">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    Save {discountPct}%
                  </span>
                )}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="bg-cream-card/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sh-2">
                    <p className="text-caption text-ink-500 font-medium leading-none">
                      Starting at
                    </p>
                    <p className="text-h3 font-extrabold text-orange-600 leading-tight mt-0.5">
                      ₹{finalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                  {test.basic_info.reportsWithin && (
                    <div className="bg-cream-card/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sh-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <p className="text-body-sm font-bold text-ink-900 leading-none">
                        {test.basic_info.reportsWithin}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-gutter pt-8 lg:pt-10">
        <LabStats />
      </div>

      <div className="mx-auto max-w-7xl px-gutter py-10 lg:py-14 grid gap-6 lg:gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {(test.basic_info.Identifies || test.basic_info.measures) && (
            <section className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                About The Test
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {test.basic_info.Identifies && (
                  <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100">
                    <p className="text-overline uppercase text-orange-700 font-bold mb-1.5 tracking-overline">
                      Identifies
                    </p>
                    <p className="text-body-sm text-ink-700 leading-relaxed">
                      {test.basic_info.Identifies}
                    </p>
                  </div>
                )}
                {test.basic_info.measures && (
                  <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100">
                    <p className="text-overline uppercase text-orange-700 font-bold mb-1.5 tracking-overline">
                      Measures
                    </p>
                    <p className="text-body-sm text-ink-700 leading-relaxed">
                      {test.basic_info.measures}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {markdownSections.map((section, i) => (
            <section
              key={`md-section-${i}`}
              className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8"
            >
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-4">
                {section.title}
              </h2>
              <MarkdownContent content={section.body} />
            </section>
          ))}

          {hasInterpretations && (
            <section className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-4">
                Test Results
              </h2>
              {test.interpretations.title && (
                <p className="text-body-sm text-ink-600 mb-4">
                  {test.interpretations.title}
                </p>
              )}
              <div className="overflow-x-auto rounded-md border border-cream-line">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-cream-soft">
                      {test.interpretations.cols.map((c, i) => (
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
                    {test.interpretations.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className="border-b border-cream-line last:border-b-0"
                      >
                        {row.map((cell, ci) => (
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

          {hasFaqs && (
            <section className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                FAQs
              </h2>
              <FaqList items={test.faqs} idPrefix="labtest-faq" />
            </section>
          )}

          {relatedTests.length > 0 && (
            <section>
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                Related Tests
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {relatedTests.slice(0, 4).map((t) => {
                  const p = getPriceNumber(t);
                  const dp = getDiscountedPriceNumber(t);
                  const tCategory = getLabTestCategoryById(
                    t.basic_info.categoryId,
                  );
                  return (
                    <TestCard
                      key={t.id}
                      name={t.testName}
                      image={t.basic_info.imageSrc || tCategory?.image}
                      price={dp || p}
                      originalPrice={dp > 0 && dp < p ? p : undefined}
                      reportTime={t.basic_info.reportsWithin}
                      href={labTestUrl(t)}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line overflow-hidden">
            <div className="bg-gradient-orange-soft p-5 border-b border-cream-line">
              <p className="text-overline uppercase text-orange-700 font-bold tracking-overline">
                Book this test
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
              {test.basic_info.reportsWithin && (
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  Reports in {test.basic_info.reportsWithin}
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <HomeIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                Free home sample collection
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
                NABL Accredited certified lab
              </li>
            </ul>

            <div className="p-5">
              <TestBookingActions
                testName={test.testName}
                finalPrice={finalPrice}
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
