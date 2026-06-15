import { ScanListing } from "@/components/scans/ScanListing";
import { scanListingMetadata } from "@/lib/scan-pages";

export const revalidate = 3600;
export const metadata = scanListingMetadata("xray-scan");

export default function XrayScanListingPage() {
  return <ScanListing familyPath="xray-scan" />;
}
