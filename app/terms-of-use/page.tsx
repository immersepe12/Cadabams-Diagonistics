import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { getPolicyPage } from "@/lib/data/allpages";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    absolute: "Terms of Use | Your Health Lab | Cadabam's Diagnostics Labs",
  },
  description:
    "The terms and conditions that apply when you use cadabamsdiagnostics.com and book services through it.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/terms-of-use" },
};

export default function TermsOfUsePage() {
  const data = getPolicyPage("terms-of-use");
  if (!data) notFound();
  return (
    <PolicyPageShell
      kind={data.kind}
      title={data.title}
      summary={data.summary}
      lastUpdated={data.lastUpdated}
      sections={data.sections.map((s) => ({
        id: s.id,
        title: s.title,
        body: <MarkdownContent content={s.body} />,
      }))}
    />
  );
}
