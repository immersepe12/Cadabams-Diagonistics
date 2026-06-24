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
 * 2. A complete Product JSON-LD block (brand, sku, category, image and a full
 *    Offer with price / currency / availability) with `additionalType` pointing
 *    at the medical schema type, so the structured data backs the OG tags.
 */

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
}: ProductSeoProps) {
  const hasPrice = Number.isFinite(price) && price > 0;
  const imageAbs = image ? toAbsolute(image) : undefined;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
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
