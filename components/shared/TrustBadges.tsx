"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface TrustBadgeItem {
  /** Pre-rendered icon element, e.g. <ShieldCheck className="w-5 h-5" />. */
  icon: React.ReactNode;
  label: string;
}

/**
 * Trust-points band shown across listing pages. On mobile the labels are too
 * long for a 2-up grid (they truncate), so we show one badge per slide in a
 * centered auto-advancing carousel; on desktop they sit in a static 4-up grid.
 */
export function TrustBadges({ items }: { items: TrustBadgeItem[] }) {
  const [autoplay] = React.useState(() =>
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (items.length === 0) return null;

  return (
    <div className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line p-4 lg:p-5">
      {/* Mobile: one badge per slide, horizontally centered, with dot indicators */}
      <div className="lg:hidden">
        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[autoplay]}
          setApi={setApi}
        >
          <CarouselContent>
            {items.map((item, i) => (
              <CarouselItem key={i} className="basis-full">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-body-sm font-semibold text-ink-900 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {items.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selected}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === selected
                    ? "w-4 bg-orange-500"
                    : "w-1.5 bg-orange-200 hover:bg-orange-300",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: static 4-up grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-orange-50 text-orange-600 flex-shrink-0">
              {item.icon}
            </span>
            <span className="text-body-sm font-semibold text-ink-900 truncate">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
