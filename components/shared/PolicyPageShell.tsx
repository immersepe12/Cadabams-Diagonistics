import Link from "next/link";
import { ReactNode } from "react";
import {
  ChevronRight,
  Home,
  CalendarDays,
  Mail,
  Phone,
  FileText,
  ShieldCheck,
  Cookie,
  RotateCcw,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactActionButton } from "@/components/shared/ContactActionButton";

export type PolicyKind =
  | "terms"
  | "privacy"
  | "cookie"
  | "refund"
  | "legal";

export interface PolicySection {
  id: string;
  title: string;
  body: ReactNode;
}

interface PolicyPageShellProps {
  kind: PolicyKind;
  title: string;
  summary: string;
  /** ISO date when this page was last updated, e.g. "2026-05-29". */
  lastUpdated: string;
  sections: PolicySection[];
  /** Optional extra content rendered at the very bottom (above the contact card). */
  outro?: ReactNode;
}

const KIND_META: Record<
  PolicyKind,
  { label: string; Icon: typeof FileText }
> = {
  terms: { label: "Terms of Use", Icon: FileText },
  privacy: { label: "Privacy Policy", Icon: ShieldCheck },
  cookie: { label: "Cookie Policy", Icon: Cookie },
  refund: { label: "Refund Policy", Icon: RotateCcw },
  legal: { label: "Legal", Icon: Scale },
};

const ALL_POLICIES: { kind: PolicyKind; href: string }[] = [
  { kind: "terms", href: "/terms-of-use" },
  { kind: "privacy", href: "/privacy-policy" },
  { kind: "cookie", href: "/cookie-policy" },
  { kind: "refund", href: "/refund-policy" },
  { kind: "legal", href: "/legal" },
];

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return DATE_FMT.format(d);
}

export function PolicyPageShell({
  kind,
  title,
  summary,
  lastUpdated,
  sections,
  outro,
}: PolicyPageShellProps) {
  const { label: kindLabel, Icon: KindIcon } = KIND_META[kind];
  const updated = formatDate(lastUpdated);

  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="relative overflow-hidden bg-gradient-orange-soft border-b border-cream-line">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-20 w-80 h-80 rounded-pill bg-orange-300/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 w-96 h-96 rounded-pill bg-coral-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-gutter pt-5 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-14">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-meta text-ink-600 mb-5 sm:mb-6 flex-wrap"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-orange-700 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-ink-300" />
            <span className="text-ink-900 font-semibold">{kindLabel}</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-pill bg-cream-card border border-orange-100 px-3 py-1 text-overline uppercase text-orange-700 font-bold tracking-overline">
            <KindIcon className="w-3.5 h-3.5" />
            {kindLabel}
          </span>

          <h1 className="mt-4 text-h2 sm:text-h1 lg:text-display-1 font-display font-extrabold text-ink-900 leading-tight tracking-tight break-words">
            {title}
          </h1>
          <p className="mt-3 sm:mt-4 text-body-sm sm:text-body lg:text-h3 text-ink-700 leading-relaxed max-w-3xl">
            {summary}
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-meta text-ink-500 font-medium bg-cream-card rounded-pill px-3 py-1 border border-cream-line">
            <CalendarDays className="w-3.5 h-3.5 text-orange-600" />
            Last updated {updated}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-gutter py-10 lg:py-14 grid gap-6 lg:gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-hidden">
          <div className="bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 p-4 lg:p-5 mb-4 lg:mb-5">
            <p className="text-meta font-bold text-ink-700 uppercase tracking-overline mb-3">
              On this page
            </p>
            <ul className="space-y-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-start gap-2 rounded-md px-2.5 py-1.5 text-body-sm text-ink-700 hover:bg-cream-soft hover:text-orange-700 transition-colors leading-snug"
                  >
                    <span className="text-meta font-bold text-orange-600 flex-shrink-0 w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 p-4 lg:p-5">
            <p className="text-meta font-bold text-ink-700 uppercase tracking-overline mb-3">
              Other policies
            </p>
            <ul className="space-y-1">
              {ALL_POLICIES.filter((p) => p.kind !== kind).map((p) => {
                const meta = KIND_META[p.kind];
                const Icon = meta.Icon;
                return (
                  <li key={p.kind}>
                    <Link
                      href={p.href}
                      className="group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm font-semibold text-ink-700 hover:bg-cream-soft hover:text-orange-700 transition-colors"
                    >
                      <span className="w-7 h-7 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0 group-hover:bg-orange-100">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="flex-1">{meta.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-ink-300 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="bg-cream-card rounded-2xl shadow-sh-1 border border-cream-line p-5 sm:p-6 lg:p-8 scroll-mt-24"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  aria-hidden
                  className="text-overline font-display font-extrabold text-orange-500 tracking-overline"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-h2 sm:text-h1 font-display font-bold text-ink-900 leading-tight tracking-tight break-words">
                  {s.title}
                </h2>
              </div>
              <div
                className={cn(
                  "text-body text-ink-700 leading-relaxed",
                  "[&_p]:mb-4 [&_p:last-child]:mb-0",
                  "[&_a]:text-orange-600 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-orange-300 hover:[&_a]:decoration-orange-600",
                  "[&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-4 [&_ul]:space-y-2",
                  "[&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-4 [&_ol]:space-y-2",
                  "[&_li]:leading-relaxed",
                  "[&_strong]:text-ink-900 [&_strong]:font-bold",
                  "[&_h3]:text-h3 [&_h3]:font-bold [&_h3]:text-ink-900 [&_h3]:mt-5 [&_h3]:mb-2",
                )}
              >
                {s.body}
              </div>
            </section>
          ))}

          {outro}

          <section className="bg-gradient-orange-soft rounded-2xl border border-orange-100 p-5 sm:p-6 lg:p-8">
            <div className="grid sm:grid-cols-[1fr_auto] gap-4 sm:gap-6 items-center">
              <div>
                <h3 className="text-h3 sm:text-h2 font-display font-bold text-ink-900">
                  Questions about this policy?
                </h3>
                <p className="text-body-sm sm:text-body text-ink-700 mt-1.5 leading-relaxed">
                  Our team is happy to walk you through anything you&apos;re
                  unsure about.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 flex-shrink-0">
                <a
                  href="mailto:info@cadabamsdiagnostics.com"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-cream-card hover:bg-cream-soft text-ink-900 font-semibold px-5 py-2.5 text-body-sm border border-cream-line transition-all"
                >
                  <Mail className="w-4 h-4 text-orange-600" />
                  Email us
                </a>
                <ContactActionButton
                  mode="call"
                  phone="+91 99001 26611"
                  context={`Question about ${title}`}
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-cta text-white font-semibold px-5 py-2.5 text-body-sm shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <Phone className="w-4 h-4" />
                  +91 99001 26611
                </ContactActionButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
