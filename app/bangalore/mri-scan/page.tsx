import { ScanListing } from "@/components/scans/ScanListing";
import { scanListingMetadata } from "@/lib/scan-pages";

export const revalidate = 3600;
export const metadata = scanListingMetadata("mri-scan");

export default function MriScanListingPage() {
  return <ScanListing familyPath="mri-scan" />;
}
