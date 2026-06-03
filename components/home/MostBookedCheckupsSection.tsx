import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { SectionOverline } from "@/components/shared/SectionOverline";
import { getNonLabTestById } from "@/lib/data/nonlabtests";
import {
  nonLabCategoryUrl,
  nonLabTestUrl,
  normalizeInternalHref,
} from "@/lib/urls";
import type { HomeMostBookedCheckups } from "@/lib/data/homepages";
import { MostBookedCarousel } from "@/components/home/MostBookedCarousel";

interface MostBookedCheckupsSectionProps {
  block: HomeMostBookedCheckups;
}

function resolveCheckupHref(
  checkupHref: string,
  categoryId: string | undefined,
): string {
  const test = getNonLabTestById(checkupHref);
  if (test) return nonLabTestUrl(test);
  if (categoryId) return nonLabCategoryUrl(categoryId);
  return normalizeInternalHref(checkupHref);
}

export function MostBookedCheckupsSection({
  block,
}: MostBookedCheckupsSectionProps) {
  const items = block.checkups.map((c) => ({
    id: c.id,
    title: c.title,
    icon: c.icon,
    href: resolveCheckupHref(c.href, c.catid),
  }));
  return (
    <section className="relative overflow-hidden py-8 lg:py-12 bg-cream-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/3 w-[28rem] h-[28rem] rounded-pill bg-gradient-to-br from-orange-200/40 to-coral-300/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-20 w-96 h-96 rounded-pill bg-gradient-to-tr from-pink-200/30 to-orange-200/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-gutter grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10 lg:items-start">
        <div className="min-w-0 lg:sticky lg:top-24 space-y-4">
          <SectionOverline>Radiology</SectionOverline>

          <h2 className="text-h1 sm:text-display-2 lg:text-display-1 text-ink-900 font-display leading-[1.1]">
            We specialise in{" "}
            <span className="relative inline-block text-orange-600">
              Radiology
              <span
                aria-hidden
                className="absolute left-0 bottom-1 w-full h-2.5 bg-orange-200/70 -z-10 rounded-sm"
              />
            </span>
          </h2>

          {block.description && (
            <p className="text-body text-ink-600 leading-relaxed max-w-md">
              {block.description}
            </p>
          )}

          {block.viewAllCheckup && (
            <div className="pt-1">
              <Link
                href={normalizeInternalHref(block.viewAllCheckup)}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-pill px-6 py-3 shadow-glow-orange transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-bg"
              >
                View all radiology
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="flex items-start gap-3 bg-cream-card rounded-2xl border border-cream-line shadow-sh-2 p-4 max-w-md mt-2">
            <span className="w-11 h-11 rounded-pill bg-gradient-cta text-white inline-flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-ink-900 leading-snug">
                Bangalore&apos;s most advanced machines
              </p>
              <p className="text-meta text-ink-600 mt-0.5">
                3T MRI, multi-slice CT, 3D/4D fetal imaging.
              </p>
            </div>
          </div>
        </div>

        <MostBookedCarousel items={items} />
      </div>
    </section>
  );
}
