/**
 * Product SEO for individual test / scan pages.
 *
 * Emits two things, shared by the lab-test and scan detail templates so every
 * test page is consistent:
 *
 * 1. Open Graph product meta tags (`og:price:amount`, `og:price:currency`,
 *    `og:availability`, `og:brand`) so social shares show price / availability
 *    / brand. These are rendered as real `<meta property=...>` elements — Next's
 *    Metadata `other` field would emit `name=` instead of `property=`, so we
 *    rely on React 19 always hoisting `<meta>` into `<head>`.
 *
 * 2. A JSON-LD @graph (BreadcrumbList + Product + MedicalWebPage + FAQPage)
 *    mirroring the legacy site's structured data, so the page is eligible for
 *    the same rich results.
 */

import {
  type Crumb,
  breadcrumbList,
  faqPage,
  graph,
  medicalWebPage,
} from "@/lib/jsonld";

const BRAND = "Cadabams Diagnostics";
const ORIGIN = "https://cadabamsdiagnostics.com";

function toAbsolute(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

interface ProductSeoProps {
  /** Test / scan name. */
  name: string;
  /** Short description (falls back handled by the caller). */
  description: string;
  /** Canonical absolute product URL. */
  url: string;
  /** Final (displayed) price in INR. Tags are omitted when this is 0/absent. */
  price: number;
  /** Hero/primary image (absolute or root-relative path). */
  image?: string | null;
  /** Stable identifier used as the product SKU. */
  sku?: string;
  /** Category label (e.g. "Blood Tests", "Ultrasound"). */
  category?: string | null;
  /** Medical schema type retained alongside the Product type. */
  medicalType: "MedicalTest" | "MedicalProcedure";
  /** Breadcrumb trail (Home → Category → Test) for BreadcrumbList. */
  breadcrumbs?: Crumb[];
  /** FAQs rendered on the page, for FAQPage. */
  faqs?: { question: string; answer: string }[];
}

export function ProductSeo({
  name,
  description,
  url,
  price,
  image,
  sku,
  category,
  medicalType,
  breadcrumbs,
  faqs,
}: ProductSeoProps) {
  const hasPrice = Number.isFinite(price) && price > 0;
  const imageAbs = image ? toAbsolute(image) : undefined;

  const product = {
    "@type": "Product",
    name,
    description,
    ...(imageAbs ? { image: imageAbs } : {}),
    ...(sku ? { sku } : {}),
    ...(category ? { category } : {}),
    brand: { "@type": "Brand", name: BRAND },
    additionalType: `https://schema.org/${medicalType}`,
    ...(hasPrice
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url,
            seller: { "@type": "Organization", name: BRAND, url: ORIGIN },
          },
        }
      : {}),
  };

  const jsonLd = graph([
    breadcrumbs && breadcrumbs.length > 1 ? breadcrumbList(breadcrumbs) : null,
    product,
    medicalWebPage({ name, description, url, image: imageAbs }),
    faqs && faqs.length > 0 ? faqPage(faqs) : null,
  ]);

  return (
    <>
      {hasPrice && (
        <>
          <meta property="og:price:amount" content={String(price)} />
          <meta property="og:price:currency" content="INR" />
          <meta property="og:availability" content="instock" />
          {/* Twitter/X summary-card rich data: shows Price / Availability. */}
          <meta name="twitter:label1" content="Price" />
          <meta name="twitter:data1" content={`₹${price.toLocaleString("en-IN")}`} />
          <meta name="twitter:label2" content="Availability" />
          <meta name="twitter:data2" content="In Stock" />
        </>
      )}
      <meta property="og:brand" content={BRAND} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
