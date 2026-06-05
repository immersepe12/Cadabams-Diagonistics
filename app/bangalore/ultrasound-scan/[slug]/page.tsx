import type { Metadata } from "next";
import { ScanDetail } from "@/components/scans/ScanDetail";
import { ScanListing } from "@/components/scans/ScanListing";
import {
  getAllScanFilterKeys,
  getScanFilterLabel,
  isScanFilterKey,
} from "@/components/scans/scanFilterGroups";
import { getNonLabTestBySlug } from "@/lib/data/nonlabtests";
import {
  scanDetailMetadata,
  scanFamilyStaticParams,
} from "@/lib/scan-pages";

export const revalidate = 86400;

const FAMILY = "ultrasound-scan";

export function generateStaticParams() {
  // Individual scan detail pages + the local-filter group listing pages.
  return [
    ...scanFamilyStaticParams(FAMILY),
    ...getAllScanFilterKeys().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (isScanFilterKey(slug) && !getNonLabTestBySlug(slug)) {
    const label = getScanFilterLabel(slug) ?? "Ultrasound";
    const title = `${label} Ultrasound Scans in Bangalore | Cadabam's Diagnostics`;
    return {
      title,
      description: `Book ${label.toLowerCase()} ultrasound scans in Bangalore at Cadabam's Diagnostics. Advanced equipment, fast reports.`,
      alternates: {
        canonical: `https://cadabamsdiagnostics.com/bangalore/${FAMILY}/${slug}`,
      },
      openGraph: { title, url: `/bangalore/${FAMILY}/${slug}`, type: "website" },
    };
  }

  return scanDetailMetadata(slug);
}

export default async function UltrasoundScanDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { slug } = await params;

  // A local-filter group slug (e.g. /bangalore/ultrasound-scan/pregnancy)
  // renders the filtered listing; anything else is an individual scan.
  if (isScanFilterKey(slug) && !getNonLabTestBySlug(slug)) {
    const sp = await searchParams;
    return (
      <ScanListing
        familyPath={FAMILY}
        searchParams={sp}
        localFilters
        initialFilterKey={slug}
      />
    );
  }

  return <ScanDetail familyPath={FAMILY} slug={slug} />;
}
