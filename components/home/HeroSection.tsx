import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  FlaskConical,
  Search,
  ShieldCheck,
  Zap,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { Homepage } from "@/lib/data/homepages";
import { normalizeInternalHref } from "@/lib/urls";

interface HeroSectionProps {
  hero: Homepage["hero"];
  features: Homepage["features"];
}

function buttonMeta(raw: string): { label: string; Icon: LucideIcon } {
  const k = raw.toLowerCase().replace(/[\s_-]/g, "");
  if (k.includes("lab")) return { label: "Lab Tests", Icon: FlaskConical };
  if (
    k.includes("radiology") ||
    k.includes("scan") ||
    k.includes("mri") ||
    k.includes("ct") ||
    k.includes("xray")
  ) {
    return { label: "Radiology Scans", Icon: Activity };
  }
  return { label: raw, Icon: FlaskConical };
}

export function HeroSection({ hero, features }: HeroSectionProps) {
  const [primaryBtn, ...secondaryBtns] = hero.buttons;

  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-pill bg-white/15 blur-3xl" />
        <span className="absolute -bottom-32 -right-20 w-[32rem] h-[32rem] rounded-pill bg-coral-300/30 blur-3xl" />
        <span className="absolute top-1/3 left-1/2 w-72 h-72 rounded-pill bg-orange-300/20 blur-3xl" />
        <span
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl w-full px-gutter pt-5 pb-5 sm:pt-6 sm:pb-6 lg:pt-8 lg:pb-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-pill bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3.5 py-1.5 text-meta font-semibold uppercase tracking-wide">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-pill bg-white/70 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-pill bg-white" />
              </span>
              <span>NABL Accredited · Trusted by 50,000+ patients</span>
            </div>

            <h1 className="font-display font-extrabold tracking-tight text-h1 sm:text-display-2 lg:text-[46px] lg:leading-[1.08]">
              <span className="block">{hero.title}</span>
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-cream-bg">
                  {hero.subtitle}
                </span>
                <span
                  aria-hidden
                  className="absolute left-0 right-0 bottom-1 h-3 bg-white/25 rounded-sm -z-0"
                />
              </span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-body-sm sm:text-body text-white/85 font-medium leading-relaxed">
              Lab tests and scans delivered with hospital-grade accuracy —
              reports in just 6 hours, home collection across Bangalore.
            </p>

            <form
              action="/search"
              method="get"
              className="relative max-w-xl mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-2 rounded-pill bg-white p-1.5 shadow-sh-3 ring-1 ring-white/40">
                <div className="flex items-center flex-1 min-w-0 pl-4">
                  <Search className="w-5 h-5 text-ink-400 flex-shrink-0" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search for tests, scans, or checkups"
                    className="w-full bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none px-3 py-2.5 text-body"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-pill bg-gradient-cta hover:brightness-110 text-white font-semibold px-5 py-2.5 text-body-sm shadow-glow-orange transition-all duration-200 active:scale-[0.97]"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
              {primaryBtn && (
                <Link
                  href={normalizeInternalHref(primaryBtn.href)}
                  className="group inline-flex items-center gap-2 bg-white text-orange-700 font-semibold rounded-pill px-6 py-3 text-body shadow-sh-3 hover:shadow-glow-soft hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
                >
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-pill bg-orange-100 text-orange-600">
                    {(() => {
                      const { Icon } = buttonMeta(primaryBtn.text);
                      return <Icon className="w-4 h-4" />;
                    })()}
                  </span>
                  {buttonMeta(primaryBtn.text).label}
                </Link>
              )}
              {secondaryBtns.map((btn) => {
                const { label, Icon } = buttonMeta(btn.text);
                return (
                  <Link
                    key={btn.id}
                    href={normalizeInternalHref(btn.href)}
                    className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-pill px-6 py-3 text-body ring-1 ring-white/30 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span className="w-7 h-7 inline-flex items-center justify-center rounded-pill bg-white/15">
                      <Icon className="w-4 h-4" />
                    </span>
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 relative mx-auto w-full max-w-[260px] sm:max-w-xs lg:max-w-sm">
            <div
              aria-hidden
              className="absolute inset-0 -m-6 rounded-full bg-gradient-glow"
            />
            <div className="relative aspect-square">
              <Image
                src={hero.imageSrc}
                alt={hero.title}
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 1024px) 80vw, 40vw"
              />
            </div>

            <div className="absolute top-4 -left-2 sm:top-8 sm:left-0 bg-cream-card rounded-2xl shadow-sh-3 px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
              <span className="w-10 h-10 rounded-pill bg-orange-100 inline-flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </span>
              <div className="text-left">
                <p className="text-caption text-ink-500 font-medium">
                  Reports in
                </p>
                <p className="text-body font-extrabold text-ink-900 leading-tight">
                  6 hours
                </p>
              </div>
            </div>

            <div className="absolute bottom-6 -right-2 sm:bottom-10 sm:right-0 bg-cream-card rounded-2xl shadow-sh-3 px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
              <span className="w-10 h-10 rounded-pill bg-tint-green inline-flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-tint-green-fg" />
              </span>
              <div className="text-left">
                <p className="text-caption text-ink-500 font-medium">
                  Accredited
                </p>
                <p className="text-body font-extrabold text-ink-900 leading-tight">
                  NABL Certified
                </p>
              </div>
            </div>
          </div>
        </div>

        {features.length > 0 && (
          <div className="mt-6 lg:mt-8 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 justify-center lg:justify-start"
              >
                <div className="relative w-9 h-9 lg:w-10 lg:h-10 flex-shrink-0 rounded-pill bg-white/15 ring-1 ring-white/25 p-1.5 backdrop-blur-sm">
                  <Image
                    src={f.icon}
                    alt=""
                    fill
                    className="object-contain p-1.5"
                    sizes="40px"
                  />
                </div>
                <p className="text-body font-semibold text-white">{f.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
