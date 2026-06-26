/**
 * Structured-data (schema.org JSON-LD) builders shared across page templates,
 * mirroring the schema set the legacy site exposes:
 *   - BreadcrumbList
 *   - Product            (test/scan detail pages)
 *   - MedicalWebPage     (every content page)
 *   - FAQPage            (pages that render FAQs)
 *   - Organization       (site-wide)
 */

import { getSiteUrl } from "@/lib/site-url";

// Host actually serving the page (staging vs production), so JSON-LD URLs stay
// consistent with the page's canonical instead of hardcoding the live domain.
const ORIGIN = getSiteUrl();
const BRAND = "Cadabam's Diagnostics";

export interface Crumb {
  name: string;
  url: string;
}

/** Plain-text from a (possibly markdown) FAQ answer, for schema `text`. */
export function plainText(s: string): string {
  return (s || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function medicalWebPage(opts: {
  name: string;
  description?: string;
  url: string;
  image?: string | null;
}) {
  return {
    "@type": "MedicalWebPage",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    url: opts.url,
    ...(opts.image ? { primaryImageOfPage: opts.image } : {}),
    // `specialty` must be a schema.org MedicalSpecialty enum value; the legacy
    // site used the invalid free-text "Medical Diagnostics", which fails the
    // Rich Results / schema.org validator. "Pathology" is the correct enum.
    specialty: "Pathology",
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Patients",
      healthCondition: {
        "@type": "MedicalCondition",
        name: "Medical Diagnostics",
      },
    },
    publisher: { "@type": "Organization", name: BRAND, url: ORIGIN },
  };
}

export function faqPage(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: plainText(f.question),
      acceptedAnswer: { "@type": "Answer", text: plainText(f.answer) },
    })),
  };
}

export function organization() {
  return {
    "@type": "Organization",
    name: BRAND,
    alternateName: "Cadabams Diagnostic Center",
    url: ORIGIN,
    logo: `${ORIGIN}/og-logo.png`,
    sameAs: [
      "https://www.facebook.com/cadabamsdiagnostics",
      "https://twitter.com/CadabamsDX",
      "https://www.instagram.com/cadabams_diagnostics/",
      "https://www.linkedin.com/company/cadabams-group/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+919900126611",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Kannada"],
    },
  };
}

/** Wrap nodes into a single `@graph` document (drops falsy nodes). */
export function graph(nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
