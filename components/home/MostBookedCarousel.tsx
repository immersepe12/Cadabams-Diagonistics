"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface MostBookedItem {
  id: string;
  title: string;
  icon: string;
  href: string;
}

/** Three tile-background variations cycled across the tiles for warm depth. */
const TILE_TONES = [
  "bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600",
  "bg-gradient-to-br from-coral-400 via-coral-400 to-orange-500",
  "bg-gradient-to-br from-orange-600 via-orange-700 to-ink-800",
];

export function MostBookedCarousel({ items }: { items: MostBookedItem[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
    };
  }, [api]);

  if (items.length === 0) return null;

  return (
    <div className="min-w-0 w-full md:self-center">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        plugins={[autoplay.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((c, i) => {
            const tone = TILE_TONES[i % TILE_TONES.length];
            return (
              <CarouselItem
                key={c.id}
                className="pl-4 basis-1/2 lg:basis-1/3"
              >
                <Link
                  href={c.href}
                  className={cn(
                    "group relative block h-44 sm:h-48 lg:h-56 rounded-2xl overflow-hidden text-white shadow-sh-2 hover:shadow-glow-orange hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-bg",
                    tone,
                  )}
                >
                  <span
                    aria-hidden
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-pill bg-white/10 group-hover:scale-125 transition-transform duration-500"
                  />
                  <span
                    aria-hidden
                    className="absolute -bottom-16 -left-10 w-28 h-28 rounded-pill bg-white/5 group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="relative h-full p-4 sm:p-5 flex flex-col justify-between">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-cream-card shadow-sh-2 inline-flex items-center justify-center overflow-hidden">
                      {c.icon && c.icon.length > 0 ? (
                        <Image
                          src={c.icon}
                          alt=""
                          width={36}
                          height={36}
                          className="object-contain w-7 h-7 sm:w-9 sm:h-9"
                        />
                      ) : (
                        <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-body-sm sm:text-h2 font-bold leading-tight">
                        {c.title}
                      </h3>
                      <span className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 text-caption sm:text-meta font-semibold text-white/90 group-hover:text-white">
                        Explore
                        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous"
            className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sh-1 disabled:hover:border-cream-line"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            aria-label="Next"
            className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sh-1 disabled:hover:border-cream-line"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
