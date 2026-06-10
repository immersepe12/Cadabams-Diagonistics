import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getAuthPage } from "@/lib/data/allpages";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your Cadabam's Diagnostics account to view reports, manage bookings and track home sample collections.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  const data = getAuthPage("login");
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
      <LoginForm />
    </AuthShell>
  );
}
