import type { Metadata } from "next";
import { LabTestListing } from "@/components/labtests/LabTestListing";
import { listingKeywords } from "@/lib/keywords";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbList, graph, medicalWebPage } from "@/lib/jsonld";

const LAB_URL = "https://cadabamsdiagnostics.com/bangalore/lab-test";

export const revalidate = 3600;

// Title + description copy mirrors the live site exactly (audit parity).
const DESCRIPTION =
  "Get accurate and reliable lab test services in Bangalore at Cadabams Diagnostics. From routine blood tests to advanced diagnostics, we ensure precise results with state-of-the-art technology and expert care. Book your test today!";

export const metadata: Metadata = {
  title: "Reliable Lab Tests in Bangalore",
  description: DESCRIPTION,
  keywords: listingKeywords("Lab Tests", [
    "blood tests bangalore",
    "diagnostic tests bangalore",
    "health checkup bangalore",
    "pathology lab bangalore",
    "home sample collection bangalore",
  ]),
  alternates: {
    canonical: "https://cadabamsdiagnostics.com/bangalore/lab-test",
  },
  openGraph: {
    title: "Reliable Lab Tests in Bangalore | Cadabam's Diagnostics",
    description: DESCRIPTION,
    url: "/bangalore/lab-test",
    type: "website",
  },
};

export default function LabTestsListPage() {
  return (
    <>
      <JsonLd
        data={graph([
          breadcrumbList([
            { name: "Home", url: "https://cadabamsdiagnostics.com" },
            { name: "Lab Tests", url: LAB_URL },
          ]),
          medicalWebPage({
            name: "Reliable Lab Tests in Bangalore | Cadabam's Diagnostics",
            description: DESCRIPTION,
            url: LAB_URL,
          }),
        ])}
      />
      <LabTestListing />
    </>
  );
}
