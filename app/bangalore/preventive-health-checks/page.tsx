import { ScanListing } from "@/components/scans/ScanListing";
import { scanListingMetadata } from "@/lib/scan-pages";

export const revalidate = 3600;
export const metadata = scanListingMetadata("preventive-health-checks");

export default function PreventiveHealthChecksListingPage() {
  return <ScanListing familyPath="preventive-health-checks" />;
}
