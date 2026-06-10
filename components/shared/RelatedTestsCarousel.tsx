"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestCard } from "@/components/shared/TestCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface RelatedTestCardVM {
  id: string;
  name: string;
  image?: string | null;
  price: number;
  originalPrice?: number;
  reportTime?: string;
  href: string;
  kind: string;
}

interface RelatedTestsCarouselProps {
  title: string;
  cards: RelatedTestCardVM[];
}

/**
 * Horizontal, single-line carousel of related tests/scans with prev/next
 * arrow controls. Reuses the shared TestCard so cards look identical to the
 * grid version — only the layout becomes a swipeable/scrollable row.
 */
export function RelatedTestsCarousel({
  title,
  cards,
}: RelatedTestsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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

  if (cards.length === 0) return null;

  // With only a couple of cards there's nothing to scroll; hide the arrows.
  const showArrows = canPrev || canNext;

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-h2 font-display font-bold text-ink-900">{title}</h2>
        {showArrows && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous"
              className="w-9 h-9 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sh-1 disabled:hover:border-cream-line"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              disabled={!canNext}
              aria-label="Next"
              className="w-9 h-9 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sh-1 disabled:hover:border-cream-line"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4 lg:-ml-5">
          {cards.map((card) => (
            <CarouselItem
              key={card.id}
              className="pl-3 sm:pl-4 lg:pl-5 basis-[85%] sm:basis-1/2 lg:basis-1/3"
            >
              <TestCard
                id={card.id}
                kind={card.kind}
                name={card.name}
                image={card.image}
                price={card.price}
                originalPrice={card.originalPrice}
                reportTime={card.reportTime}
                href={card.href}
                className="h-full"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
