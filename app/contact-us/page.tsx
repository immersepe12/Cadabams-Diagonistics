import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticPageShell } from "@/components/shared/StaticPageShell";
import { ContactFormSection } from "@/components/home/ContactFormSection";
import { getContactPage } from "@/lib/data/allpages";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    absolute:
      "Contact Us | Cadabam's Diagnostics - Leading Diagnostic Center in Bangalore",
  },
  description:
    "Get in touch with Cadabam's Diagnostics. Phone, email, WhatsApp, and addresses for all our Bangalore centres.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/contact-us" },
};

function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export default function ContactUsPage() {
  const data = getContactPage();
  if (!data) notFound();

  return (
    <>
      <StaticPageShell
        overline={data.overline}
        title={data.title}
        description={data.description}
        bodyMaxWidth="max-w-7xl"
      />
      <ContactFormSection
        logo={data.contactForm.logo}
        phone={data.contactForm.phone}
        email={data.contactForm.email}
        address={data.contactForm.address}
        centers={data.centres.map((c) => ({
          name: titleCase(c.area),
          address: c.address,
          href: c.href,
        }))}
      />
    </>
  );
}
