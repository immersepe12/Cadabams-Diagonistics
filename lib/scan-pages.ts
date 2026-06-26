import type { Metadata } from "next";
import {
  getNonLabTestBySlug,
  getNonLabTestCategoryBySlug,
  getNonLabTestsByCategoryId,
} from "@/lib/data/nonlabtests";
import { stripLeadingSlash } from "@/lib/data/types";
import { nonLabTestUrl } from "@/lib/urls";
import { listingKeywords } from "@/lib/keywords";
import { pageTitle } from "@/lib/seo-title";
import { breadcrumbList, faqPage, graph, medicalWebPage } from "@/lib/jsonld";
import { getSiteUrl } from "@/lib/site-url";

export function scanFamilyStaticParams(familyPath: string): { slug: string }[] {
  const category = getNonLabTestCategoryBySlug(familyPath);
  if (!category) return [];
  return getNonLabTestsByCategoryId(category.id)
    .map((t) => ({ slug: stripLeadingSlash(t.route) }))
    .filter((p) => p.slug.length > 0);
}

// Listing-page <title>s mirror the live site ("<Family> Scan Centre in
// Bangalore"). Falls back to a generated title for families not listed.
const LISTING_TITLE: Record<string, string> = {
  "ct-scan": "CT Scan Centre in Bangalore",
  "mri-scan": "MRI Scan Centre in Bangalore",
  "ultrasound-scan": "Ultrasound Scan Centre in Bangalore",
  "xray-scan": "X-ray Scan Centre in Bangalore",
  "pregnancy-scan": "Pregnancy Scan Centre in Bangalore",
  "msk-scan": "MSK Scan Centre in Bangalore",
};

// Listing-page meta descriptions mirror the live site.
const LISTING_DESCRIPTION: Record<string, string> = {
  "ct-scan":
    "Book CT scans for advanced diagnostic imaging in Bangalore. Trusted diagnostic centers with quick results.",
  "mri-scan":
    "Get accurate imaging with MRI scans in Bangalore. Trusted diagnostic centers with quick results.",
  "msk-scan":
    "Book diagnostic scans in Bangalore. Trusted diagnostic centers with quick results.",
  "pregnancy-scan":
    "Book pregnancy scans for comprehensive prenatal care in Bangalore. Trusted diagnostic centers with quick results.",
  "ultrasound-scan":
    "Book ultrasound scans for accurate imaging in Bangalore. Trusted diagnostic centers with quick results.",
  "xray-scan":
    "Book X-ray scans for accurate results in Bangalore. Trusted diagnostic centers with quick results.",
};

export function scanListingTitle(familyPath: string): string {
  const category = getNonLabTestCategoryBySlug(familyPath);
  if (!category) return "";
  return LISTING_TITLE[familyPath] || `${category.name} in Bangalore`;
}

export function scanListingDescription(familyPath: string): string {
  const category = getNonLabTestCategoryBySlug(familyPath);
  if (!category) return "";
  return (
    LISTING_DESCRIPTION[familyPath] ||
    `Book ${category.name.toLowerCase()} in Bangalore at Cadabam's Diagnostics. Advanced equipment, certified team, fast reports. Trusted by 10,000+ patients.`
  );
}

/** JSON-LD @graph (Breadcrumb + MedicalWebPage + FAQPage) for a scan listing. */
export function scanListingJsonLd(
  familyPath: string,
  faqs: { question: string; answer: string }[],
  image?: string | null,
) {
  const category = getNonLabTestCategoryBySlug(familyPath);
  if (!category) return null;
  const origin = getSiteUrl();
  const url = `${origin}/bangalore/${familyPath}`;
  return graph([
    breadcrumbList([
      { name: "Home", url: origin },
      { name: "Bangalore", url: `${origin}/bangalore` },
      { name: category.name, url },
    ]),
    medicalWebPage({
      name: `${scanListingTitle(familyPath)} | Cadabam's Diagnostics`,
      description: scanListingDescription(familyPath),
      url,
      image,
    }),
    faqs.length > 0 ? faqPage(faqs) : null,
  ]);
}

export function scanListingMetadata(familyPath: string): Metadata {
  const category = getNonLabTestCategoryBySlug(familyPath);
  if (!category) return {};
  // Relative path: Next resolves it against `metadataBase` (= getSiteUrl()),
  // so canonical/OG URLs point at the host actually serving the page (staging
  // on staging, production once SITE_URL is set) instead of a hardcoded domain.
  const url = `/bangalore/${familyPath}`;
  const title = scanListingTitle(familyPath);
  const description = scanListingDescription(familyPath);
  return {
    title,
    description,
    keywords: listingKeywords(category.name, [
      `${category.name.toLowerCase()} scan in bangalore`,
      "radiology centre in bangalore",
      "diagnostic imaging bangalore",
    ]),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Cadabam's Diagnostics`,
      description,
      url,
      type: "website",
    },
  };
}

/** Title used for a scan family's listing OG image — matches its page title. */
export function scanListingOgTitle(familyPath: string): string {
  const category = getNonLabTestCategoryBySlug(familyPath);
  return `${category?.name ?? "Scans"} in Bangalore`;
}

export function scanDetailMetadata(slug: string): Metadata {
  const test = getNonLabTestBySlug(slug);
  if (!test) return {};
  const fallbackTitle = `${test.testName} in Bangalore`;
  const fallbackDesc =
    `Book ${test.testName} scan in Bangalore. ${test.basic_info.Identifies || ""}`.trim();
  // Relative fallback resolves against metadataBase (= getSiteUrl()), so the
  // canonical is self-referential on staging and production-correct at go-live.
  const canonical = test.seo?.canonicalUrl || nonLabTestUrl(test);
  return {
    title: pageTitle(test.seo?.title || fallbackTitle),
    description: test.seo?.description || fallbackDesc,
    alternates: { canonical },
    openGraph: {
      title: test.seo?.ogTitle || test.seo?.title || fallbackTitle,
      description:
        test.seo?.ogDescription || test.seo?.description || fallbackDesc,
      type: "article",
      // Omit `images` when there's no custom SEO image so the generated
      // per-route opengraph-image is used; a custom seo.ogImage still wins.
      ...(test.seo?.ogImage ? { images: [{ url: test.seo.ogImage }] } : {}),
    },
  };
}
