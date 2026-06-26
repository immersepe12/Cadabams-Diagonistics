import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Quote,
  Star,
  ShieldCheck,
  Building2,
  Sparkles,
  Stethoscope,
  FlaskConical,
  ScanLine,
  Activity,
  Baby,
  Bone,
  Heart,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  getAllCenterSlugs,
  getAllCenters,
  getCenterBySlug,
  getCenterSlug,
} from "@/lib/data/centers";
import { centerUrl } from "@/lib/urls";
import { getSiteUrl } from "@/lib/site-url";
import { pageTitle } from "@/lib/seo-title";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { LabStats } from "@/components/shared/LabStats";
import { ContactActionButton } from "@/components/shared/ContactActionButton";
import { CentersListCard } from "@/components/shared/CentersListCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FaqList } from "@/components/shared/FaqList";

export const revalidate = 86400;

const FALLBACK = "/shared/image-1727884059139-383535423.webp";

/**
 * Pick a meaningful icon for a service card based on its title. The source
 * `service.icon` images are often generic stock photos, so a themed lucide
 * icon keeps the cards clean and consistent.
 */
function serviceIcon(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (/lab|blood|patholog|test|cbc|profile/.test(t)) return FlaskConical;
  if (/ultrasound|sonograph|doppler/.test(t)) return Activity;
  if (/pregnan|women|fetal|obstetric|maternal/.test(t)) return Baby;
  if (/msk|bone|ortho|joint|spine/.test(t)) return Bone;
  if (/heart|cardio|echo/.test(t)) return Heart;
  if (/x-?ray|mri|ct|scan|radiolog|imaging/.test(t)) return ScanLine;
  return Stethoscope;
}

/**
 * Map a service to the relevant listing page so the card is clickable. Falls
 * back to the lab-test hub when the title doesn't match a known scan family.
 */
function serviceHref(title: string): string {
  const t = title.toLowerCase();
  if (/x-?ray/.test(t)) return "/bangalore/xray-scan";
  if (/ultrasound|sonograph|doppler/.test(t)) return "/bangalore/ultrasound-scan";
  if (/mri/.test(t)) return "/bangalore/mri-scan";
  if (/\bct\b|computed tomograph/.test(t)) return "/bangalore/ct-scan";
  if (/msk|muscul|ortho|joint/.test(t)) return "/bangalore/msk-scan";
  if (/pregnan|women|fetal|obstetric|maternal/.test(t))
    return "/bangalore/pregnancy-scan";
  if (/preventive|health check/.test(t))
    return "/bangalore/preventive-health-checks";
  if (/radiolog|imaging/.test(t)) return "/bangalore/ultrasound-scan";
  return "/bangalore/lab-test";
}

interface MarkdownSection {
  title: string;
  body: string;
}

function isMeaningfulText(s: string, minLen: number): boolean {
  const trimmed = s.trim();
  if (trimmed.length < minLen) return false;
  if (!/\s/.test(trimmed)) return false;
  const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length;
  if (vowels < 3) return false;
  return true;
}

function isPlaceholderTitle(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed.length < 4) return true;
  if (/\s/.test(trimmed)) return false;
  const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length;
  const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letters === 0) return true;
  if (vowels / letters < 0.25) return true;
  return false;
}

function splitMarkdownByH2(markdown: string): MarkdownSection[] {
  if (!markdown || markdown.trim().length === 0) return [];
  const lines = markdown.split(/\r?\n/);
  const raw: MarkdownSection[] = [];
  let current: MarkdownSection | null = null;
  const preamble: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+?)\s*$/);
    if (h2Match) {
      if (current) raw.push(current);
      current = { title: h2Match[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      preamble.push(line);
    }
  }
  if (current) raw.push(current);

  const preambleText = preamble.join("\n").trim();
  if (preambleText.length > 0) {
    const capitalized =
      preambleText.charAt(0).toUpperCase() + preambleText.slice(1);
    raw.unshift({ title: "About this centre", body: capitalized });
  }

  return raw
    .map((s) => ({ title: s.title, body: s.body.trim() }))
    .filter((s) => {
      if (isPlaceholderTitle(s.title)) return false;
      if (s.body.length === 0) return false;
      if (!isMeaningfulText(s.body, 20)) return false;
      return true;
    });
}

function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateStaticParams() {
  return getAllCenterSlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const center = getCenterBySlug(slug);
  if (!center) return {};
  // Strip any embedded brand so the root template appends exactly one suffix.
  const title = pageTitle(
    center.seo?.title || center.basic_info.center_name,
  );
  const description =
    center.seo?.description ||
    `Visit ${center.basic_info.center_name} for accurate diagnostics, lab tests, and scans. ${center.center_info.address}`;
  const canonical = centerUrl(center);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Cadabam's Diagnostics`,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function CenterDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const center = getCenterBySlug(slug);
  if (!center) notFound();

  const phones = center.center_info.phone
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const primaryPhone = phones[0] ?? "";
  const heroImage =
    center.basic_info.center_image && center.basic_info.center_image.length > 0
      ? center.basic_info.center_image
      : FALLBACK;

  const currentSlug = getCenterSlug(center);
  const sidebarCenters = getAllCenters()
    .filter((c) => c.basic_info?.center_name?.trim().length > 0)
    .map((c) => ({
      name: c.basic_info.center_name.trim(),
      slug: getCenterSlug(c),
    }));

  const services = center.services.filter(
    (s) => s.title && s.title.trim().length > 0,
  );
  // All linked tests across every service, deduped — rendered once below the
  // service cards rather than inside individual cards.
  const centreTests = (() => {
    const seen = new Set<string>();
    return services
      .flatMap((s) => s.tests)
      .filter(
        (t) =>
          t.id &&
          t.testName &&
          t.testName.trim().length > 0 &&
          !seen.has(t.id) &&
          seen.add(t.id),
      );
  })();
  const testimonials = center.testimonials.filter(
    (t) =>
      t.content &&
      t.content.trim().length > 0 &&
      isMeaningfulText(t.content, 20),
  );
  const team = center.team.filter(
    (m) => m.name && m.name.trim().length > 0,
  );
  const markdownSections = splitMarkdownByH2(center.markdown ?? "");
  const faqs = (center.faqs ?? []).filter(
    (f) =>
      isMeaningfulText(f.question, 8) && isMeaningfulText(f.answer, 8),
  );
  const hasFaqs = faqs.length > 0;

  // Host serving the page (staging vs production) for absolute JSON-LD URLs.
  const origin = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: center.basic_info.center_name,
    description: center.basic_info.center_sub_title,
    address: {
      "@type": "PostalAddress",
      streetAddress: center.center_info.address,
      addressLocality: center.basic_info.city,
      addressCountry: "IN",
    },
    telephone: primaryPhone,
    email: center.center_info.email,
    url: `${origin}${centerUrl(center)}`,
    image: heroImage.startsWith("/")
      ? `${origin}${heroImage}`
      : heroImage,
    medicalSpecialty: services.map((s) => s.title),
  };

  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="relative overflow-hidden bg-gradient-orange-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-pill bg-orange-300/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-10 w-96 h-96 rounded-pill bg-coral-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-gutter pt-4 pb-6 sm:pt-5 sm:pb-8 lg:pt-6 lg:pb-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/bangalore">Bangalore</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-md">
                  {center.basic_info.center_name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4 sm:mt-5 lg:mt-6 grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[1fr_380px] items-start min-w-0">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-cream-card border border-cream-line px-3 py-1 text-overline uppercase text-orange-700 font-bold">
                <Building2 className="w-3.5 h-3.5" />
                Diagnostic centre · {titleCase(center.basic_info.area)}
              </span>

              <h1 className="text-h2 sm:text-h1 lg:text-display-1 font-display font-extrabold text-ink-900 leading-tight tracking-tight">
                {center.basic_info.center_name}
              </h1>

              {center.basic_info.center_sub_title && (
                <p className="text-body lg:text-h3 text-ink-700 leading-relaxed max-w-2xl">
                  {center.basic_info.center_sub_title}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {center.working_hours.weekdays && (
                  <span className="inline-flex items-center gap-2 bg-cream-card rounded-pill px-4 py-2 text-body-sm font-semibold text-ink-800 shadow-sh-1 border border-cream-line">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    Mon–Sat {center.working_hours.weekdays.start}–
                    {center.working_hours.weekdays.end}
                  </span>
                )}
                {center.working_hours.sunday && (
                  <span className="inline-flex items-center gap-2 bg-cream-card rounded-pill px-4 py-2 text-body-sm font-semibold text-ink-800 shadow-sh-1 border border-cream-line">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    Sun {center.working_hours.sunday.start}–
                    {center.working_hours.sunday.end}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 bg-cream-card rounded-pill px-4 py-2 text-body-sm font-semibold text-ink-800 shadow-sh-1 border border-cream-line">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  NABL Accredited
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Link
                  href="/bangalore/lab-test"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-cta text-white font-bold px-6 py-3 text-body shadow-glow-orange ring-2 ring-orange-300/30 hover:brightness-110 hover:-translate-y-0.5 hover:ring-orange-400/50 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  Book a test
                </Link>
                {primaryPhone && (
                  <ContactActionButton
                    mode="call"
                    phone={primaryPhone}
                    context={center.basic_info.center_name}
                    className="inline-flex items-center justify-center gap-2 rounded-pill bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-6 py-3 text-body border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
                  >
                    <Phone className="w-4 h-4" />
                    Call {primaryPhone}
                  </ContactActionButton>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-card shadow-sh-3 border border-cream-line">
                <Image
                  src={heroImage}
                  alt={center.basic_info.center_name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 440px"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/40 to-transparent"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="bg-cream-card/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sh-2 max-w-[70%]">
                    <p className="text-caption text-ink-500 font-medium leading-none">
                      Address
                    </p>
                    <p className="text-body-sm font-semibold text-ink-900 leading-snug mt-1 line-clamp-2">
                      {center.center_info.address}
                    </p>
                  </div>
                  {center.center_info.map_location && (
                    <a
                      href={center.center_info.map_location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-cream-card/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sh-2 flex items-center gap-1.5 text-body-sm font-bold text-orange-600 hover:text-orange-700 transition-colors flex-shrink-0"
                    >
                      <MapPin className="w-4 h-4" />
                      Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-gutter pt-8 lg:pt-10">
        <LabStats />
      </div>

      <div className="mx-auto max-w-7xl px-gutter py-8 lg:py-10 grid gap-6 lg:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          {markdownSections.map((section, i) => (
            <section
              key={`md-section-${i}`}
              className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8"
            >
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-4">
                {section.title}
              </h2>
              <MarkdownContent content={section.body} />
            </section>
          ))}

          {services.length > 0 && (
            <section className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                Services at this centre
              </h2>
              <div className="columns-1 sm:columns-2 gap-4">
                {services.map((service) => {
                  const Icon = serviceIcon(service.title);
                  const descLines = (service.description ?? "")
                    .split(/\n+/)
                    .map((l) => l.trim())
                    .filter(Boolean);
                  const hasDescription = descLines.length > 0;
                  return (
                    <Link
                      key={service.id}
                      href={serviceHref(service.title)}
                      className="group block break-inside-avoid mb-4 rounded-xl border border-cream-line bg-cream-soft p-5 hover:border-orange-300 hover:shadow-sh-2 transition-all"
                    >
                      <div
                        className={`flex gap-3 ${hasDescription ? "items-start" : "items-center"}`}
                      >
                        <span className="w-11 h-11 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-h3 font-bold text-ink-900 leading-tight group-hover:text-orange-700 transition-colors">
                            {service.title}
                          </h3>
                          {hasDescription &&
                            (descLines.length > 1 ? (
                              <ul className="mt-2 space-y-1">
                                {descLines.map((line, i) => (
                                  <li
                                    key={i}
                                    className="flex gap-2 text-body-sm text-ink-700"
                                  >
                                    <span className="mt-[7px] w-1 h-1 rounded-pill bg-orange-400 flex-shrink-0" />
                                    <span className="leading-snug">{line}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-body-sm text-ink-700 leading-relaxed">
                                {descLines[0]}
                              </p>
                            ))}
                        </div>
                        <ArrowRight className="w-4 h-4 text-ink-400 flex-shrink-0 mt-1 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {centreTests.length > 0 && (
                <div className="mt-6 pt-6 border-t border-cream-line">
                  <p className="text-meta font-bold text-ink-700 uppercase tracking-overline mb-3">
                    Popular tests at this centre
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {centreTests.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/bangalore/lab-test${t.route}`}
                          className="inline-flex items-center bg-cream-soft text-meta text-ink-700 font-medium border border-cream-line rounded-pill px-3 py-1.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                        >
                          {t.testName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {team.length > 0 && (
            <section className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                Meet the Team
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {team.map((m) => (
                  <article
                    key={m.id}
                    className="flex gap-4 rounded-xl border border-cream-line bg-cream-soft p-4 hover:border-orange-200 transition-colors"
                  >
                    {m.image && m.image.length > 0 ? (
                      <div className="relative w-20 h-20 rounded-pill overflow-hidden flex-shrink-0 bg-cream-card shadow-sh-1">
                        <Image
                          src={m.image.startsWith("/") ? m.image : FALLBACK}
                          alt={m.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <span className="w-20 h-20 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0 shadow-sh-1">
                        <Stethoscope className="w-8 h-8" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-body font-bold text-ink-900 leading-snug">
                        {m.name}
                      </h3>
                      {m.designation && (
                        <p className="text-meta text-orange-700 font-semibold mt-1">
                          {m.designation}
                        </p>
                      )}
                      {m.qualification && (
                        <p className="text-meta text-ink-600 mt-1">
                          {m.qualification}
                        </p>
                      )}
                      {m.experience && (
                        <p className="text-meta text-ink-500 mt-0.5">
                          {m.experience.trim()} experience
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {testimonials.length > 0 && (
            <section className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                Patient Stories
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {testimonials.slice(0, 4).map((t) => (
                  <article
                    key={t.id}
                    className="rounded-xl border border-cream-line bg-cream-soft p-5 flex flex-col"
                  >
                    <Quote className="w-7 h-7 text-orange-300 mb-3 flex-shrink-0" />
                    <p className="text-body-sm text-ink-700 leading-relaxed flex-1">
                      {t.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-cream-line">
                      <div className="min-w-0">
                        <p className="text-body-sm font-bold text-ink-900 truncate">
                          {t.name}
                        </p>
                        {t.location && (
                          <p className="text-meta text-ink-500 truncate">
                            {t.location}
                          </p>
                        )}
                      </div>
                      <div
                        className="flex items-center gap-0.5 text-orange-500 flex-shrink-0"
                        aria-label={`Rated ${t.rating} out of 5`}
                      >
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        {Array.from({ length: 5 - t.rating }).map((_, i) => (
                          <Star
                            key={`empty-${i}`}
                            className="w-3.5 h-3.5 text-ink-300"
                          />
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {hasFaqs && (
            <section className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                FAQs
              </h2>
              <FaqList items={faqs} idPrefix="center-faq" />
            </section>
          )}
        </div>

        <aside className="lg:col-span-1 min-w-0">
          <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line overflow-hidden">
            <div className="bg-gradient-orange-soft p-5 border-b border-cream-line">
              <p className="text-overline uppercase text-orange-700 font-bold tracking-overline">
                Visit this centre
              </p>
              <h3 className="text-h3 font-bold text-ink-900 leading-snug mt-1 line-clamp-2">
                {center.basic_info.center_name}
              </h3>
            </div>

            <ul className="px-5 py-4 space-y-3 text-body-sm text-ink-700 border-b border-cream-line">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>{center.center_info.address}</span>
              </li>
              {phones.length > 0 && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    {phones.map((p) => (
                      <ContactActionButton
                        key={p}
                        mode="call"
                        phone={p}
                        context={center.basic_info.center_name}
                        className="block text-left text-ink-900 hover:text-orange-600 transition-colors font-semibold"
                      >
                        {p}
                      </ContactActionButton>
                    ))}
                  </div>
                </li>
              )}
              {center.center_info.email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${center.center_info.email}`}
                    className="text-ink-900 hover:text-orange-600 transition-colors break-all"
                  >
                    {center.center_info.email}
                  </a>
                </li>
              )}
              {center.working_hours.weekdays && (
                <li className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Mon–Sat: {center.working_hours.weekdays.start}–
                    {center.working_hours.weekdays.end}
                    {center.working_hours.sunday && (
                      <>
                        <br />
                        Sun: {center.working_hours.sunday.start}–
                        {center.working_hours.sunday.end}
                      </>
                    )}
                  </span>
                </li>
              )}
            </ul>

            <div className="p-5 space-y-3">
              <Link
                href="/bangalore/lab-test"
                className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-cta text-white font-bold px-6 py-3 text-body shadow-glow-orange ring-2 ring-orange-300/30 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                Book a test
              </Link>
              {center.center_info.map_location && (
                <a
                  href={center.center_info.map_location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-cream-soft hover:bg-cream-line text-ink-900 font-semibold px-6 py-3 text-body border border-cream-line transition-all"
                >
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Open in Maps
                </a>
              )}
            </div>
          </div>

          <div className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line overflow-hidden">
            <div className="px-5 py-3 border-b border-cream-line flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <p className="text-meta font-bold text-ink-700 uppercase tracking-overline">
                Find us on map
              </p>
            </div>
            <iframe
              title={`Map showing ${center.basic_info.center_name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${center.basic_info.center_name}, ${center.center_info.address}`,
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full aspect-[4/3] border-0"
              allowFullScreen
            />
            {center.center_info.map_location && (
              <a
                href={center.center_info.map_location}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-5 py-3 text-center text-body-sm font-semibold text-orange-600 hover:text-orange-700 border-t border-cream-line transition-colors"
              >
                Open in Google Maps →
              </a>
            )}
          </div>

          <CentersListCard
            centers={sidebarCenters}
            activeSlug={currentSlug}
            heading="Our other centres"
          />
          </div>
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
