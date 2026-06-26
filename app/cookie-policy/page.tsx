import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { getPolicyPage } from "@/lib/data/allpages";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Cadabam's Diagnostics uses cookies and similar technologies on cadabamsdiagnostics.com.",
  alternates: {
    canonical: "/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  const data = getPolicyPage("cookie-policy");
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
