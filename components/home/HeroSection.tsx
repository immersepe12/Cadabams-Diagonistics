import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  FlaskConical,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

      <div className="relative mx-auto max-w-7xl w-full px-gutter pt-3 pb-4 sm:pt-4 sm:pb-5 lg:pt-5 lg:pb-6">
        <div className="grid gap-5 lg:gap-6 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
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
                  className="absolute left-0 right-0 bottom-1 h-3 bg-white/25 rounded-sm z-0"
                />
              </span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-body-sm sm:text-body text-white/85 font-medium leading-relaxed">
              Lab tests and scans delivered with hospital-grade accuracy —
              reports in just 6 hours, home collection across Bangalore.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start gap-3 pt-1 max-w-xs sm:max-w-none mx-auto lg:mx-0">
              {primaryBtn && (
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="group h-auto w-full sm:w-auto justify-start gap-2.5 rounded-pill bg-white py-2.5 pr-5 pl-3 text-body font-bold text-ink-900 shadow-sh-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream-soft focus-visible:ring-white/70"
                >
                  <Link href={normalizeInternalHref(primaryBtn.href)}>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-pill bg-orange-100 text-orange-600">
                      {(() => {
                        const { Icon } = buttonMeta(primaryBtn.text);
                        return <Icon className="h-4 w-4" />;
                      })()}
                    </span>
                    {buttonMeta(primaryBtn.text).label}
                    <ArrowRight className="h-4 w-4 ml-auto sm:ml-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
              {secondaryBtns.map((btn) => {
                const { label, Icon } = buttonMeta(btn.text);
                return (
                  <Button
                    key={btn.id}
                    asChild
                    variant="secondary"
                    size="lg"
                    className="group h-auto w-full sm:w-auto justify-start gap-2.5 rounded-pill bg-white py-2.5 pr-5 pl-3 text-body font-bold text-ink-900 shadow-sh-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream-soft focus-visible:ring-white/70"
                  >
                    <Link href={normalizeInternalHref(btn.href)}>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-pill bg-tint-green text-tint-green-fg">
                        <Icon className="h-4 w-4" />
                      </span>
                      {label}
                      <ArrowRight className="h-4 w-4 ml-auto sm:ml-0 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 relative mx-auto w-full max-w-[290px] sm:max-w-xs lg:max-w-sm">
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
                className="object-contain object-bottom drop-shadow-2xl"
                sizes="(max-width: 1024px) 80vw, 40vw"
              />
            </div>

            <div className="absolute bottom-4 -right-3 sm:bottom-8 sm:-right-6 lg:bottom-10 lg:right-0 bg-cream-card rounded-2xl shadow-sh-3 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-pill bg-tint-green inline-flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-tint-green-fg" />
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
          <div className="mt-5 lg:mt-6 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 sm:gap-6">
            {features.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 justify-start sm:justify-center lg:justify-start"
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
