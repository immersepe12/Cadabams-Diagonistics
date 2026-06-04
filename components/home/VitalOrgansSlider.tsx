"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { VitalOrganTile, type VitalOrganItem } from "./VitalOrganTile";

export function VitalOrgansSlider({ items }: { items: VitalOrganItem[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
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
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        plugins={[autoplay.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {items.map((cat, i) => (
            <CarouselItem
              key={cat.id}
              className="pl-3 sm:pl-4 basis-1/2 sm:basis-1/3"
            >
              <VitalOrganTile item={cat} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
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
