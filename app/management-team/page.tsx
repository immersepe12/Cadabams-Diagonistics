import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Sparkles,
  Calendar,
  Users,
  Star,
  Target,
  Check,
  Phone,
} from "lucide-react";
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
  title: "Management Team | Leadership & Vision",
  description:
    "Meet the visionary leaders of Cadabam's Diagnostics. Our management team brings 30+ years of healthcare excellence, led by Chairman Cadabam M Ramesh and an experienced executive board.",
  alternates: {
    canonical: "https://cadabamsdiagnostics.com/management-team",
  },
};

const STATS = [
  { Icon: Calendar, value: "30+", label: "Years of Excellence" },
  { Icon: Users, value: "100+", label: "Team Members" },
  { Icon: Star, value: "95%", label: "Patient Satisfaction" },
  { Icon: Target, value: "5", label: "Specialized Departments" },
] as const;

interface Leader {
  name: string;
  role: string;
  description: string;
  achievements: string[];
  /**
   * Optional headshot from public/management/ (e.g.
   * "/management/cadabam-m-ramesh.webp"). When absent, an initials avatar is
   * shown instead.
   */
  image?: string;
}

const TEAM: Leader[] = [
  {
    name: "Cadabam M Ramesh",
    role: "Chairman, Cadabam's Group",
    image: "/management/cadabam-m-ramesh.webp",
    description:
      "Mr. Cadabam M. Ramesh, the nucleus of the organization, envisioned Cadabams as a place for treatment and solace for every kind of healthcare concern. Founded with a vision of delivering excellence to patients, he has driven unparalleled service and new outcomes across the Cadabam's Group.",
    achievements: [
      "Steering board priorities",
      "Focus on infrastructure development",
      "Emphasis on quality healthcare",
      "Creating a nurturing work environment",
    ],
  },
  {
    name: "Sudha R. Cadabam",
    role: "Vice Chairperson, Cadabam's Group",
    image: "/management/sudha-r-cadabam.webp",
    description:
      "Mrs. Sudha R. Cadabam oversees the Cadabam's Group's growth and sustainability. With 20 years of expertise, she shapes, structures, and enables smooth, ideal functioning across the organization.",
    achievements: [
      "20+ years of healthcare expertise",
      "Focus on organizational growth",
      "Patient care enhancement",
      "Staff development initiatives",
    ],
  },
  {
    name: "M.K. Saraswathi",
    role: "Vice Chairperson, Cadabam's Group",
    image: "/management/mk-saraswathi.webp",
    description:
      "Ms. M. K. Saraswathi has made an immense contribution to Cadabam's with over two decades of expertise in psychology. With her administrative skills and strategies, she designed the healthcare system to structure operational efficiency.",
    achievements: [
      "20+ years in psychology",
      "Healthcare system design",
      "Operational efficiency",
      "Department supervision",
    ],
  },
  {
    name: "Sandesh Cadabam",
    role: "Director",
    image: "/management/sandesh-cadabam.webp",
    description:
      "Mr. Sandesh R. Cadabam, a promising entrepreneur within the organization, is passionate about providing healthcare to international standards. With an MSc. in International Business & Management from Manchester Business School, UK, he brings innovative strategic methods and modern thinking to the organization.",
    achievements: [
      "International healthcare expertise",
      "Strategic innovation",
      "Team development",
      "Quality healthcare focus",
    ],
  },
  {
    name: "Neha S. Cadabam",
    role: "Executive Director & Psychologist",
    image: "/management/neha-s-cadabam.webp",
    description:
      "Neha Cadabam is a Psychologist at Cadabam's with over 11 years of experience in mental health. She specializes in preventive and promotive mental healthcare, helping individuals improve their well-being and adopt healthier lifestyle changes.",
    achievements: [
      "11+ years in mental health",
      "Certified NLP Practitioner",
      "Multi-lingual expertise",
      "Specialized counseling approaches",
    ],
  },
];

function initials(name: string): string {
  const parts = name.replace(/^(mr|mrs|ms|dr)\.?\s+/i, "").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function ManagementTeamPage() {
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
                  Management team
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 sm:mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3 py-1 text-overline uppercase font-bold tracking-overline">
              <Sparkles className="w-3.5 h-3.5" />
              Leadership & Vision
            </span>
            <h1 className="mt-4 text-h1 sm:text-display-2 lg:text-[52px] lg:leading-[1.05] font-display font-extrabold tracking-tight">
              Our management team.
            </h1>
            <p className="mt-4 text-body sm:text-h3 text-white/90 leading-relaxed max-w-2xl">
              Meet the visionaries leading Cadabam&apos;s towards excellence in
              healthcare — with 30+ years of combined experience steering
              quality, growth, and patient-first care.
            </p>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-7xl px-gutter -mt-6 lg:-mt-10 relative z-10">
        <div className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line p-4 lg:p-5 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {STATS.map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 lg:w-12 lg:h-12 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0">
                <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </span>
              <div className="min-w-0">
                <p className="text-h2 lg:text-display-2 font-display font-extrabold text-orange-600 leading-none">
                  {value}
                </p>
                <p className="text-caption lg:text-meta text-ink-600 font-medium mt-0.5 lg:mt-1 truncate">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-gutter py-8 sm:py-10 lg:py-12">
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <p className="text-overline uppercase text-orange-700 font-bold mb-2 tracking-overline">
            Meet the leadership
          </p>
          <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight leading-tight">
            The visionaries behind Cadabam&apos;s.
          </h2>
        </div>

        <div className="space-y-5 lg:space-y-6">
          {TEAM.map((m) => (
            <article
              key={m.name}
              className="bg-cream-card rounded-2xl shadow-sh-1 hover:shadow-sh-2 border border-cream-line transition-shadow duration-200 overflow-hidden grid lg:grid-cols-[300px_1fr]"
            >
              {/* Identity panel */}
              <div className="bg-gradient-orange-soft p-6 sm:p-7 flex items-center gap-4 lg:flex-col lg:items-start lg:justify-center border-b lg:border-b-0 lg:border-r border-cream-line">
                {m.image ? (
                  <span className="relative w-16 h-16 lg:w-24 lg:h-24 rounded-pill overflow-hidden bg-cream-card shadow-sh-2 ring-2 ring-white flex-shrink-0">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className="object-cover object-top"
                      sizes="96px"
                    />
                  </span>
                ) : (
                  <span className="w-16 h-16 lg:w-20 lg:h-20 inline-flex items-center justify-center rounded-pill bg-gradient-cta text-white font-display font-extrabold text-h2 lg:text-h1 shadow-glow-orange flex-shrink-0">
                    {initials(m.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="text-h3 lg:text-h2 font-display font-bold text-ink-900 leading-tight">
                    {m.name}
                  </h3>
                  <p className="mt-1 text-meta lg:text-body-sm font-bold uppercase tracking-overline text-orange-700">
                    {m.role}
                  </p>
                </div>
              </div>

              {/* Bio + contributions */}
              <div className="p-6 sm:p-7 lg:p-8">
                <p className="text-body text-ink-700 leading-relaxed">
                  {m.description}
                </p>
                <div className="mt-5">
                  <p className="text-overline uppercase text-orange-700 font-bold tracking-overline mb-3">
                    Key contributions
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2.5">
                    {m.achievements.map((a) => (
                      <li
                        key={a}
                        className="flex items-start gap-2.5 text-body-sm text-ink-700"
                      >
                        <span className="w-5 h-5 rounded-pill bg-success-bg text-success inline-flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
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
                  Get in touch with our management
                </p>
                <h2 className="text-h1 sm:text-display-2 font-display font-extrabold tracking-tight leading-tight">
                  Want to learn more about our leadership?
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
                  <ChevronRight className="w-4 h-4" />
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
        </div>
      </section>
    </main>
  );
}
