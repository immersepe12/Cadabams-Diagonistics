import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticPageShell } from "@/components/shared/StaticPageShell";
import { ContactFormSection } from "@/components/home/ContactFormSection";
import { ContactActionButton } from "@/components/shared/ContactActionButton";
import { getContactPage } from "@/lib/data/allpages";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contact us",
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
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.centres.map((c) => (
            <article
              key={c.id}
              className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-6"
            >
              <p className="text-overline uppercase text-orange-600 font-bold">
                {titleCase(c.area)}
              </p>
              <h2 className="text-h3 font-bold text-ink-900 mt-1 leading-snug">
                {c.name}
              </h2>
              <p className="mt-3 text-body-sm text-ink-700 leading-relaxed">
                {c.address}
              </p>
              <div className="mt-4 space-y-1.5 text-body-sm">
                {c.phone && (
                  <p>
                    <span className="text-ink-500">Phone: </span>
                    <ContactActionButton
                      mode="call"
                      phone={c.phone}
                      context={c.name}
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      {c.phone}
                    </ContactActionButton>
                  </p>
                )}
                {c.email && (
                  <p>
                    <span className="text-ink-500">Email: </span>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-orange-600 hover:text-orange-700 font-semibold break-all"
                    >
                      {c.email}
                    </a>
                  </p>
                )}
              </div>
              {c.weekdays && (
                <p className="mt-3 text-meta text-ink-500">
                  Mon–Sat {c.weekdays.start}–{c.weekdays.end}
                  {c.sunday && (
                    <>
                      {" · "}Sun {c.sunday.start}–{c.sunday.end}
                    </>
                  )}
                </p>
              )}
            </article>
          ))}
        </div>
      </StaticPageShell>
      <ContactFormSection
        logo={data.contactForm.logo}
        phone={data.contactForm.phone}
        email={data.contactForm.email}
        address={data.contactForm.address}
      />
    </>
  );
}
