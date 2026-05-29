import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  ShieldCheck,
  Award,
  HeartPulse,
  Database,
  Stethoscope,
  ClipboardCheck,
  Sparkles,
  Users,
  Building2,
  Phone,
} from "lucide-react";
import { getAllCenters } from "@/lib/data/centers";
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
  title: "Management team",
  description:
    "The leadership behind Cadabam's Diagnostics — the clinical-governance, quality, patient-experience, and technology principles that guide every centre across Bangalore.",
  alternates: {
    canonical: "https://cadabamsdiagnostics.com/management-team",
  },
};

const FOCUS_AREAS = [
  {
    Icon: ClipboardCheck,
    title: "Clinical governance",
    body: "Regular peer review, double-blind reporting on critical imaging, and ongoing CME for every clinician on the panel.",
  },
  {
    Icon: Award,
    title: "Quality & accreditation",
    body: "NABL-aligned lab processes, calibrated equipment, and reproducible reference ranges that stay consistent across every centre.",
  },
  {
    Icon: HeartPulse,
    title: "Patient experience",
    body: "Transparent pricing, predictable report timelines, and a dedicated team for safe, on-time home sample collection.",
  },
  {
    Icon: Database,
    title: "Technology & data",
    body: "Digital reports over WhatsApp and email, secure record-keeping, and a referral workflow built to respect your data.",
  },
];

const PRINCIPLES = [
  {
    title: "Accuracy is non-negotiable",
    body: "Every critical result is reviewed before it reaches you. We would rather re-run a sample than ship a doubtful number.",
  },
  {
    title: "Respect your time",
    body: "Most lab reports land within 6 hours and routine scans are read the same day — because waiting on health answers is its own kind of stress.",
  },
  {
    title: "Care, not transactions",
    body: "From the phlebotomist at your door to the radiologist on the report, the goal is the same: treat every patient like family.",
  },
];

export default function ManagementTeamPage() {
  const centerCount = getAllCenters().filter(
    (c) => c.basic_info?.center_name?.trim().length > 0,
  ).length;

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

        <div className="relative mx-auto max-w-7xl px-gutter pt-5 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-24">
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
                  Management team
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 sm:mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3 py-1 text-overline uppercase font-bold tracking-overline">
              <Sparkles className="w-3.5 h-3.5" />
              Leadership
            </span>
            <h1 className="mt-4 text-h1 sm:text-display-2 lg:text-[52px] lg:leading-[1.05] font-display font-extrabold tracking-tight">
              The team behind Cadabam&apos;s Diagnostics.
            </h1>
            <p className="mt-4 text-body sm:text-h3 text-white/90 leading-relaxed max-w-2xl">
              A multidisciplinary leadership team that blends clinical
              expertise with operational rigour — keeping patient outcomes at
              the centre of every decision, across {centerCount} centres in
              Bangalore.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership philosophy */}
      <section className="mx-auto max-w-7xl px-gutter py-12 sm:py-14 lg:py-20">
        <div className="grid gap-8 lg:gap-14 lg:grid-cols-2 items-start">
          <div>
            <p className="text-overline uppercase text-orange-700 font-bold mb-3 tracking-overline">
              How we lead
            </p>
            <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
              Clinical expertise, operational rigour.
            </h2>
            <p className="mt-4 text-body sm:text-h3 text-ink-700 leading-relaxed">
              From day-to-day centre operations to long-term clinical strategy,
              our leadership works hand-in-hand with the medical team. The
              brief is simple: build a diagnostic network you can trust with
              your family&apos;s health.
            </p>
            <p className="mt-4 text-body text-ink-700 leading-relaxed">
              That means investing in the right equipment, holding ourselves to
              accreditation standards, and designing every touchpoint —
              booking, collection, reporting — around the patient.
            </p>
          </div>

          <ul className="space-y-4">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.title}
                className="flex gap-4 bg-cream-card rounded-2xl shadow-sh-1 border border-cream-line p-5"
              >
                <span className="w-9 h-9 inline-flex items-center justify-center rounded-pill bg-gradient-cta text-white font-display font-extrabold text-body flex-shrink-0 shadow-glow-orange">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-h3 font-bold text-ink-900 leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-body-sm text-ink-600 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Focus areas */}
      <section className="bg-cream-soft py-12 sm:py-14 lg:py-20 border-y border-cream-line">
        <div className="mx-auto max-w-7xl px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <p className="text-overline uppercase text-orange-700 font-bold mb-3 tracking-overline">
              What our leadership owns
            </p>
            <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
              Four pillars, every decision.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FOCUS_AREAS.map(({ Icon, title, body }) => (
              <article
                key={title}
                className="bg-cream-card rounded-2xl shadow-sh-1 hover:shadow-sh-3 border border-cream-line hover:border-orange-200 transition-all duration-200 p-5 sm:p-6 hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-pill bg-orange-50 inline-flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-h3 font-bold text-ink-900 leading-snug">
                  {title}
                </h3>
                <p className="mt-2 text-body-sm text-ink-600 leading-relaxed">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-7xl px-gutter py-12 sm:py-14 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard value="2020" label="Founded" Icon={Sparkles} />
          <StatCard
            value={`${centerCount}`}
            label="Centres in Bangalore"
            Icon={Building2}
          />
          <StatCard value="1M+" label="Tests delivered" Icon={Users} />
          <StatCard value="NABL" label="Accredited labs" Icon={ShieldCheck} />
        </div>
      </section>

      {/* Meet the clinical team */}
      <section className="bg-cream-soft py-12 sm:py-14 lg:py-20 border-y border-cream-line">
        <div className="mx-auto max-w-5xl px-gutter">
          <div className="bg-cream-card rounded-3xl shadow-sh-2 border border-cream-line p-6 sm:p-8 lg:p-10 grid gap-6 lg:grid-cols-[auto_1fr] items-center">
            <span className="w-16 h-16 inline-flex items-center justify-center rounded-2xl bg-gradient-cta text-white shadow-glow-orange flex-shrink-0">
              <Stethoscope className="w-8 h-8" />
            </span>
            <div>
              <h2 className="text-h2 sm:text-h1 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
                Meet the specialists who read your reports.
              </h2>
              <p className="mt-2 text-body text-ink-600 leading-relaxed">
                Our radiologists and clinical experts bring decades of combined
                experience in fetal medicine, musculoskeletal imaging, and
                diagnostic radiology.
              </p>
              <Link
                href="/clinical-team"
                className="mt-5 inline-flex items-center gap-2 rounded-pill bg-gradient-cta text-white font-bold px-6 py-3 text-body shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all"
              >
                View the clinical team
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-5xl px-gutter py-12 sm:py-14 lg:py-20">
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
                Partnerships & press
              </p>
              <h2 className="text-h1 sm:text-display-2 font-display font-extrabold tracking-tight leading-tight">
                Want to work with us?
              </h2>
              <p className="mt-3 text-body lg:text-h3 text-white/85 max-w-xl leading-relaxed">
                For partnerships, press, or governance enquiries, our team is
                one message away.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-white text-orange-700 font-bold px-6 py-3 text-body shadow-sh-2 hover:brightness-95 active:scale-[0.98] transition-all"
              >
                Contact us
              </Link>
              <ContactActionButton
                mode="call"
                phone="+91 99006 64696"
                context="Management team — enquiry"
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 text-body border border-white/30 transition-all"
              >
                <Phone className="w-4 h-4" />
                Talk to us
              </ContactActionButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  value,
  label,
  Icon,
}: {
  value: string;
  label: string;
  Icon: typeof Users;
}) {
  return (
    <div className="bg-cream-card rounded-2xl shadow-sh-1 border border-cream-line p-4 sm:p-5 lg:p-6 flex items-center gap-3 sm:gap-4">
      <span className="w-10 h-10 sm:w-12 sm:h-12 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </span>
      <div className="min-w-0">
        <p className="text-h2 sm:text-display-2 font-display font-extrabold text-orange-600 leading-none">
          {value}
        </p>
        <p className="text-caption sm:text-meta text-ink-600 font-medium mt-1 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}
