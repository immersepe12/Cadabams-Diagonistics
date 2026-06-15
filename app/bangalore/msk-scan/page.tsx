import { ScanListing } from "@/components/scans/ScanListing";
import { scanListingMetadata } from "@/lib/scan-pages";

export const revalidate = 3600;
export const metadata = scanListingMetadata("msk-scan");

export default function MskScanListingPage() {
  return <ScanListing familyPath="msk-scan" />;
}
