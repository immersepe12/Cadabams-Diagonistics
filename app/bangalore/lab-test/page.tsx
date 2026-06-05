import type { Metadata } from "next";
import { LabTestListing } from "@/components/labtests/LabTestListing";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Lab Tests in Bangalore",
  description:
    "Book lab tests in Bangalore at best prices. Complete Blood Count, Thyroid, Diabetes, Liver Function, Lipid Profile and more — with home sample collection.",
  alternates: {
    canonical: "https://cadabamsdiagnostics.com/bangalore/lab-test",
  },
  openGraph: {
    title: "Lab Tests in Bangalore | Cadabams Diagnostics",
    description:
      "Book lab tests in Bangalore at best prices with home sample collection.",
    url: "/bangalore/lab-test",
    type: "website",
  },
};

export default function LabTestsListPage() {
  return <LabTestListing />;
}
