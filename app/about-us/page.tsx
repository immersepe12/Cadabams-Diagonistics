import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Activity,
  Award,
  Beaker,
  BadgeCheck,
  Building2,
  ChevronRight,
  Clock,
  HeartPulse,
  Home,
  type LucideIcon,
  Microscope,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { getAboutUsPage } from "@/lib/data/allpages";
import { LabStats } from "@/components/shared/LabStats";
import { ContactActionButton } from "@/components/shared/ContactActionButton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    absolute:
      "About Us | Leading Diagnostic Center in Bangalore | Cadabam's Diagnostics",
  },
  description:
    "Discover Cadabam's Diagnostics - Bangalore's premier diagnostic center with 30+ years of excellence. Advanced imaging, expert medical team, and comprehensive healthcare services.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/about-us" },
};

const ICONS: Record<string, LucideIcon> = {
  Activity,
  Award,
  Beaker,
  BadgeCheck,
  Building2,
  Clock,
  HeartPulse,
  Microscope,
  Phone,
  ShieldCheck,
  Stethoscope,
  Users,
};
const Icon = ({ name, className }: { name: string; className?: string }) => {
  const C = ICONS[name] ?? Sparkles;
  return <C className={className} />;
};

export default function AboutUsPage() {
  // Source the page's data from its route file (data/allpages/about-us/page.json).
  const about = getAboutUsPage();
  if (!about) notFound();
  const { hero, mission, values, services, milestones, centres, cta } = about;

  return (
    <main className="bg-cream-bg min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-pill bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-pill bg-coral-400/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-gutter pt-4 pb-8 sm:pt-5 sm:pb-10 lg:pt-6 lg:pb-14">
          <Breadcrumb>
            <BreadcrumbList className="text-white/80">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <Home className="w-3.5 h-3.5" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-semibold">
                  About us
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4 sm:mt-6 grid gap-6 lg:gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3 py-1 text-overline uppercase font-bold tracking-overline">
                <Sparkles className="w-3.5 h-3.5" />
                {hero.badge}
              </span>
              <h1 className="mt-4 text-h1 sm:text-display-2 lg:text-[52px] lg:leading-[1.05] font-display font-extrabold tracking-tight">
                {hero.title}
              </h1>
              <p className="mt-4 text-body sm:text-h3 text-white/90 leading-relaxed max-w-2xl">
                {hero.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {hero.buttons.map((b, i) => (
                  <Link
                    key={b.href}
                    href={b.href}
                    className={
                      i === 0
                        ? "inline-flex items-center justify-center gap-2 rounded-pill bg-white text-orange-700 font-bold px-6 py-3 text-body shadow-sh-2 hover:brightness-95 active:scale-[0.98] transition-all"
                        : "inline-flex items-center justify-center gap-2 rounded-pill bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 text-body border border-white/30 transition-all"
                    }
                  >
                    <Icon name={b.icon} className="w-4 h-4" />
                    {b.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              {hero.stats.map((s) => (
                <StatTile
                  key={s.label}
                  value={s.value}
                  label={s.label}
                  iconName={s.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-only stats row (replaces the hidden lg: tiles above) */}
      <div className="lg:hidden mx-auto max-w-7xl px-gutter -mt-6">
        <LabStats />
      </div>

      {/* Our mission */}
      <section className="mx-auto max-w-7xl px-gutter py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:gap-14 lg:grid-cols-2 items-center">
          <div>
            <p className="text-overline uppercase text-orange-700 font-bold mb-3 tracking-overline">
              {mission.overline}
            </p>
            <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
              {mission.title}
            </h2>
            {mission.body.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "mt-4 text-body sm:text-h3 text-ink-700 leading-relaxed"
                    : "mt-4 text-body text-ink-700 leading-relaxed"
                }
              >
                {p}
              </p>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              {mission.highlights.map((h) => (
                <Highlight key={h.text} iconName={h.icon} text={h.text} />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] sm:aspect-[5/4] rounded-3xl overflow-hidden bg-cream-card shadow-sh-3 border border-cream-line">
              <Image
                src={mission.image.src}
                alt={mission.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 600px"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/40 to-transparent"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line px-4 py-3 flex items-center gap-3">
              <span className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600">
                <Icon name={mission.badge.icon} className="w-5 h-5" />
              </span>
              <div>
                <p className="text-caption text-ink-500 font-medium leading-none">
                  {mission.badge.label}
                </p>
                <p className="text-body font-extrabold text-ink-900 leading-tight mt-0.5">
                  {mission.badge.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-soft py-8 sm:py-10 lg:py-12 border-y border-cream-line">
        <div className="mx-auto max-w-7xl px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <p className="text-overline uppercase text-orange-700 font-bold mb-3 tracking-overline">
              {values.overline}
            </p>
            <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
              {values.title}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {values.items.map((v) => (
              <article
                key={v.title}
                className="bg-cream-card rounded-2xl shadow-sh-1 hover:shadow-sh-3 border border-cream-line hover:border-orange-200 transition-all duration-200 p-5 sm:p-6 hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-pill bg-orange-50 inline-flex items-center justify-center mb-3">
                  <Icon name={v.icon} className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-h3 font-bold text-ink-900 leading-snug">
                  {v.title}
                </h3>
                <p className="mt-2 text-body-sm text-ink-600 leading-relaxed">
                  {v.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-gutter py-8 sm:py-10 lg:py-12">
        <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-overline uppercase text-orange-700 font-bold mb-2 tracking-overline">
              {services.overline}
            </p>
            <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
              {services.title}
            </h2>
            <p className="mt-3 text-body text-ink-600 leading-relaxed">
              {services.labTestCount}+ lab tests, {services.scanCount}+
              radiology scans, and curated checkup packages — all under one
              accredited roof.
            </p>
          </div>
          <Link
            href="/bangalore/lab-test"
            className="inline-flex items-center gap-1.5 text-body-sm font-bold text-orange-600 hover:text-orange-700"
          >
            Explore all tests
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {services.items.map((s) => (
            <Link
              key={s.title}
              href={s.href ?? "#"}
              className="group bg-cream-card rounded-2xl shadow-sh-1 hover:shadow-sh-3 border border-cream-line hover:border-orange-200 transition-all duration-200 p-5 sm:p-6 flex flex-col hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-pill bg-gradient-cta text-white inline-flex items-center justify-center mb-3 shadow-glow-orange">
                <Icon name={s.icon} className="w-5 h-5" />
              </div>
              <h3 className="text-h3 font-bold text-ink-900 leading-snug">
                {s.title}
              </h3>
              <p className="mt-2 text-body-sm text-ink-600 leading-relaxed flex-1">
                {s.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                Explore
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cream-soft py-8 sm:py-10 lg:py-12 border-y border-cream-line">
        <div className="mx-auto max-w-7xl px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <p className="text-overline uppercase text-orange-700 font-bold mb-3 tracking-overline">
              {milestones.overline}
            </p>
            <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
              {milestones.title}
            </h2>
          </div>
          <ol className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {milestones.items.map((m, i) => (
              <li
                key={m.year}
                className="relative bg-cream-card rounded-2xl shadow-sh-1 border border-cream-line p-5 sm:p-6"
              >
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-cta rounded-t-2xl"
                />
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-overline font-display font-extrabold text-orange-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center rounded-pill bg-orange-50 border border-orange-100 text-orange-700 text-meta font-bold px-2.5 py-0.5">
                    {m.year}
                  </span>
                </div>
                <h3 className="text-h3 font-bold text-ink-900 leading-snug">
                  {m.title}
                </h3>
                <p className="mt-2 text-body-sm text-ink-600 leading-relaxed">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Centres */}
      <section
        id="our-centres"
        className="mx-auto max-w-7xl px-gutter py-8 sm:py-10 lg:py-12"
      >
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <p className="text-overline uppercase text-orange-700 font-bold mb-2 tracking-overline">
            {centres.overline}
          </p>
          <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
            {centres.items.length} centres, one consistent standard.
          </h2>
          <p className="mt-3 text-body text-ink-600 leading-relaxed">
            {centres.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {centres.items.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="group bg-cream-card rounded-2xl shadow-sh-1 hover:shadow-sh-3 border border-cream-line hover:border-orange-200 transition-all duration-200 p-5 flex flex-col hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0 group-hover:bg-orange-100">
                  <Building2 className="w-5 h-5" />
                </span>
                <h3 className="text-body sm:text-h3 font-bold text-ink-900 leading-snug">
                  {c.name}
                </h3>
              </div>
              <p className="text-body-sm text-ink-600 leading-relaxed line-clamp-3 mb-4">
                {c.address}
              </p>
              <div className="mt-auto pt-3 border-t border-cream-line-soft flex items-center justify-between gap-3">
                <span className="text-meta text-ink-500 font-medium">
                  {c.phone}
                </span>
                <span className="inline-flex items-center gap-1 text-body-sm font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                  Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-cream-soft py-8 sm:py-10 lg:py-12 border-t border-cream-line">
        <div className="mx-auto max-w-5xl px-gutter">
          <div className="relative overflow-hidden bg-gradient-hero text-white rounded-3xl shadow-sh-3 p-8 sm:p-10 lg:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-pill bg-white/15 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-10 w-80 h-80 rounded-pill bg-coral-300/30 blur-3xl"
            />
            <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr] items-center">
              <div>
                <p className="text-overline uppercase font-bold text-white/80 mb-2 tracking-overline">
                  {cta.overline}
                </p>
                <h2 className="text-h1 sm:text-display-2 font-display font-extrabold tracking-tight leading-tight">
                  {cta.title}
                </h2>
                <p className="mt-3 text-body lg:text-h3 text-white/85 max-w-xl leading-relaxed">
                  {cta.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
                <Link
                  href={cta.primary.href}
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-white text-orange-700 font-bold px-6 py-3 text-body shadow-sh-2 hover:brightness-95 active:scale-[0.98] transition-all"
                >
                  <Icon name={cta.primary.icon} className="w-4 h-4" />
                  {cta.primary.label}
                </Link>
                <ContactActionButton
                  mode="call"
                  phone={cta.call.phone}
                  context="About us — call back"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 text-body border border-white/30 transition-all"
                >
                  <Icon name={cta.call.icon} className="w-4 h-4" />
                  {cta.call.label}
                </ContactActionButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatTile({
  value,
  label,
  iconName,
}: {
  value: string;
  label: string;
  iconName: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 lg:p-5 flex items-center gap-3">
      <span className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-white/15 ring-1 ring-white/25 flex-shrink-0">
        <Icon name={iconName} className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="text-h2 lg:text-display-2 font-display font-extrabold leading-none">
          {value}
        </p>
        <p className="text-meta text-white/85 font-medium mt-1 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}

function Highlight({
  iconName,
  text,
}: {
  iconName: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-cream-card rounded-pill border border-cream-line shadow-sh-1 px-3 py-2 text-body-sm font-semibold text-ink-700">
      <Icon name={iconName} className="w-4 h-4 text-orange-600 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}
