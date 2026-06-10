import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { getPolicyPage } from "@/lib/data/allpages";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Cadabam's Diagnostics collects, uses, and protects your personal and health information.",
  alternates: {
    canonical: "https://cadabamsdiagnostics.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const data = getPolicyPage("privacy-policy");
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
