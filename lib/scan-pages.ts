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

export function scanFamilyStaticParams(familyPath: string): { slug: string }[] {
  const category = getNonLabTestCategoryBySlug(familyPath);
  if (!category) return [];
  return getNonLabTestsByCategoryId(category.id)
    .map((t) => ({ slug: stripLeadingSlash(t.route) }))
    .filter((p) => p.slug.length > 0);
}

export function scanListingMetadata(familyPath: string): Metadata {
  const category = getNonLabTestCategoryBySlug(familyPath);
  if (!category) return {};
  const url = `https://cadabamsdiagnostics.com/bangalore/${familyPath}`;
  const title = `${category.name} in Bangalore`;
  const description = `Book ${category.name.toLowerCase()} in Bangalore at Cadabam's Diagnostics. Advanced equipment, certified team, fast reports. Trusted by 10,000+ patients.`;
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
      title: `${title} | Cadabams Diagnostics`,
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
  const canonical =
    test.seo?.canonicalUrl ||
    `https://cadabamsdiagnostics.com${nonLabTestUrl(test)}`;
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
