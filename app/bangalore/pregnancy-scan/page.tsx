import { ScanListing } from "@/components/scans/ScanListing";
import { scanListingMetadata } from "@/lib/scan-pages";

export const revalidate = 3600;
export const metadata = scanListingMetadata("pregnancy-scan");

export default function PregnancyScanListingPage() {
  return <ScanListing familyPath="pregnancy-scan" />;
}
