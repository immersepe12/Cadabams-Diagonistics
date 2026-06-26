import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Home,
  Sparkles,
  Stethoscope,
  GraduationCap,
  Activity,
  Trophy,
  Check,
  ShieldCheck,
  Users,
  Award,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { getClinicalTeamPage } from "@/lib/data/allpages";
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
      "Clinical Team | Expert Radiologists & Specialists | Cadabam's Diagnostics",
  },
  description:
    "Meet our expert team of radiologists and specialists at Cadabam's Diagnostics. Led by Dr. S Pradeep, Dr. Divya Cadabam, and Dr. Shreyas Cadabam, offering specialized diagnostic services in Bangalore.",
  alternates: { canonical: "/clinical-team" },
};

const ICONS: Record<string, LucideIcon> = {
  Users,
  Award,
  ShieldCheck,
  Stethoscope,
};

export default function ClinicalTeamPage() {
  const data = getClinicalTeamPage();
  if (!data) notFound();
  const { hero, stats, section, doctors, cta } = data;

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
                  Clinical team
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 sm:mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3 py-1 text-overline uppercase font-bold tracking-overline">
              <Stethoscope className="w-3.5 h-3.5" />
              {hero.badge}
            </span>
            <h1 className="mt-4 text-h1 sm:text-display-2 lg:text-[52px] lg:leading-[1.05] font-display font-extrabold tracking-tight">
              {hero.title}
            </h1>
            <p className="mt-4 text-body sm:text-h3 text-white/90 leading-relaxed max-w-2xl">
              {hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-7xl px-gutter -mt-6 lg:-mt-10 relative z-10">
        <div className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line p-4 lg:p-5 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {stats.map((s) => (
            <MiniStat
              key={s.label}
              Icon={ICONS[s.icon] ?? Users}
              value={s.value}
              label={s.label}
            />
          ))}
        </div>
      </section>

      {/* Doctor profiles */}
      <section className="mx-auto max-w-7xl px-gutter py-8 sm:py-10 lg:py-12">
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <p className="text-overline uppercase text-orange-700 font-bold mb-2 tracking-overline">
            {section.overline}
          </p>
          <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
            {section.title}
          </h2>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {doctors.map((doc) => (
            <article
              key={doc.name}
              className="bg-cream-card rounded-2xl shadow-sh-1 hover:shadow-sh-2 border border-cream-line transition-shadow duration-200 overflow-hidden grid lg:grid-cols-[320px_1fr]"
            >
              {/* Photo + identity */}
              <div className="relative bg-gradient-orange-soft border-b lg:border-b-0 lg:border-r border-cream-line">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[340px] overflow-hidden">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-900/70 to-transparent"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-h2 font-display font-extrabold text-white leading-tight">
                      {doc.name}
                    </h3>
                    <p className="mt-1 text-body-sm font-semibold text-white/90">
                      {doc.qualifications}
                    </p>
                    <p className="mt-1 text-meta text-white/80">
                      {doc.position}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 sm:p-7 lg:p-8">
                <p className="text-body text-ink-700 leading-relaxed">
                  {doc.description}
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailList
                    Icon={GraduationCap}
                    title="Education & Experience"
                    items={doc.education}
                  />
                  <DetailList
                    Icon={Activity}
                    title="Areas of Expertise"
                    items={doc.expertise}
                  />
                </div>

                {doc.achievements.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-cream-line-soft">
                    <h4 className="flex items-center gap-2 text-overline uppercase text-orange-700 font-bold tracking-overline mb-3">
                      <Trophy className="w-3.5 h-3.5" />
                      Achievements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {doc.achievements.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center rounded-pill bg-orange-50 border border-orange-100 text-orange-700 text-meta font-semibold px-3 py-1"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
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
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href={cta.primary.href}
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-white text-orange-700 font-bold px-6 py-3 text-body shadow-sh-2 hover:brightness-95 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  {cta.primary.label}
                </Link>
                <ContactActionButton
                  mode="call"
                  phone={cta.call.phone}
                  context="Clinical team — consultation"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 text-body border border-white/30 transition-all"
                >
                  <Phone className="w-4 h-4" />
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

function DetailList({
  Icon,
  title,
  items,
}: {
  Icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-overline uppercase text-orange-700 font-bold tracking-overline mb-3">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h4>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-body-sm text-ink-700 leading-snug"
          >
            <span className="w-5 h-5 rounded-pill bg-success-bg text-success inline-flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MiniStat({
  Icon,
  value,
  label,
}: {
  Icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="text-h3 font-display font-extrabold text-ink-900 leading-none">
          {value}
        </p>
        <p className="text-caption text-ink-500 font-medium mt-0.5 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}
