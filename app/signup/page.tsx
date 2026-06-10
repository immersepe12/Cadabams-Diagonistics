import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";
import { getAuthPage } from "@/lib/data/allpages";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a Cadabam's Diagnostics account to book lab tests and scans, access reports, and arrange home sample collection across Bangalore.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/signup" },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  const data = getAuthPage("signup");
  if (!data) notFound();
  return (
    <AuthShell
      overline={data.overline}
      heading={data.heading}
      subheading={data.subheading}
      footer={
        <>
          {data.footerText}{" "}
          <Link
            href={data.footerLinkHref}
            className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            {data.footerLinkLabel}
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
