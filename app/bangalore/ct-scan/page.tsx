import { ScanListing } from "@/components/scans/ScanListing";
import { scanListingMetadata } from "@/lib/scan-pages";

export const revalidate = 3600;
export const metadata = scanListingMetadata("ct-scan");

export default function CtScanListingPage() {
  return <ScanListing familyPath="ct-scan" />;
}
