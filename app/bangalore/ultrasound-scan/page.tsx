import { ScanListing } from "@/components/scans/ScanListing";
import { scanListingMetadata } from "@/lib/scan-pages";

export const revalidate = 3600;
export const metadata = scanListingMetadata("ultrasound-scan");

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function UltrasoundScanListingPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  return (
    <ScanListing familyPath="ultrasound-scan" searchParams={sp} localFilters />
  );
}
