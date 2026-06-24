import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { getPolicyPage } from "@/lib/data/allpages";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    absolute: "Refund Policy | Your Health Lab | Cadabam's Diagnostics Labs",
  },
  description:
    "How refunds, cancellations, and rescheduling work for lab tests, scans, and health checkups booked with Cadabam's Diagnostics.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/refund-policy" },
};

export default function RefundPolicyPage() {
  const data = getPolicyPage("refund-policy");
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
