import { ScanListing } from "@/components/scans/ScanListing";
import { scanListingMetadata } from "@/lib/scan-pages";

export const revalidate = 3600;
export const metadata = scanListingMetadata("ultrasound-scan");

export default function UltrasoundScanListingPage() {
  return <ScanListing familyPath="ultrasound-scan" localFilters />;
}
