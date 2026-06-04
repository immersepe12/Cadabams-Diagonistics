import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { SectionOverline } from "@/components/shared/SectionOverline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

/**
 * "View all radiology" has no dedicated landing page in the app, and the
 * stored href (`/non-labtest`) is not a real route — so the CTA used to lead
 * nowhere. Point it at the existing MRI scan hub, our flagship radiology page.
 */
const RADIOLOGY_HUB_HREF = "/bangalore/mri-scan";

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

      <div className="relative mx-auto max-w-7xl px-gutter grid gap-8 md:grid-cols-[5fr_7fr] md:gap-10 md:items-start">
        <div className="min-w-0 md:sticky md:top-24 space-y-4">
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

          <div className="pt-1">
            <Button
              asChild
              size="lg"
              className="group h-auto w-full sm:w-auto rounded-pill bg-orange-500 px-6 py-3 text-body font-semibold text-white shadow-glow-orange transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:ring-orange-500/50"
            >
              <Link href={RADIOLOGY_HUB_HREF}>
                View all radiology
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <Link
            href={RADIOLOGY_HUB_HREF}
            className="group mt-2 flex max-w-md items-center gap-3 rounded-2xl border border-cream-line bg-cream-card p-4 shadow-sh-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-sh-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-bg"
          >
            <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-pill bg-gradient-cta text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-body-sm font-bold leading-snug text-ink-900">
                  Bangalore&apos;s most advanced machines
                </p>
                <Badge
                  variant="secondary"
                  className="flex-shrink-0 bg-tint-green text-tint-green-fg"
                >
                  NABL
                </Badge>
              </div>
              <p className="mt-0.5 text-meta text-ink-600">
                3T MRI, multi-slice CT, 3D/4D fetal imaging.
              </p>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-ink-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-600" />
          </Link>
        </div>

        <MostBookedCarousel items={items} />
      </div>
    </section>
  );
}
