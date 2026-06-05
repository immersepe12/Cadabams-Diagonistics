"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, FlaskConical, Zap } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { BookNowButton } from "@/components/shared/BookNowButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface FeaturedTestCard {
  id: string;
  name: string;
  href: string;
  reportsWithin: string;
  price: number;
  discountedPrice: number;
  discountPct: number;
  /** "Lab Test" or "Center Visit Only". */
  kind: string;
}

interface FeaturedTestsSliderProps {
  title: string;
  cards: FeaturedTestCard[];
}

function normaliseReportTime(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // Compact runs like "60mins" -> "60 mins", "6hours" -> "6 hours"
  return trimmed.replace(/^(\d+)\s*(min|minute|hour|hr|day)s?$/i, (_, n, u) => {
    const unit = u.toLowerCase().startsWith("min")
      ? "mins"
      : u.toLowerCase().startsWith("hour") || u.toLowerCase().startsWith("hr")
        ? "hours"
        : `${u.toLowerCase()}s`;
    return `${n} ${unit}`;
  });
}

export function FeaturedTestsSlider({
  title,
  cards,
}: FeaturedTestsSliderProps) {
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

  if (cards.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="mb-4 lg:mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-overline uppercase text-orange-600 font-bold mb-1.5">
              Most booked
            </p>
            <h2 className="text-h2 sm:text-h1 lg:text-display-2 text-ink-900 font-display">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/bangalore/lab-test"
              className="hidden sm:inline-flex items-center gap-1 text-body-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors mr-1"
            >
              See all tests
              <ChevronRight className="w-4 h-4" />
            </Link>
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
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-4 lg:-ml-5">
            {cards.map((card) => {
              const showStrike =
                card.discountPct > 0 && card.price > card.discountedPrice;
              const report = normaliseReportTime(card.reportsWithin);
              return (
                <CarouselItem
                  key={card.id}
                  className="pl-3 sm:pl-4 lg:pl-5 basis-[82%] sm:basis-1/2 lg:basis-1/4"
                >
                  <article
                    className="group relative h-full bg-cream-card rounded-xl shadow-sh-1 hover:shadow-sh-3 border border-cream-line hover:border-orange-200 transition-all duration-200 overflow-hidden hover:-translate-y-0.5 flex flex-col"
                  >
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-cta"
                />

                <div className="p-3 sm:p-4 lg:p-5 pt-4 sm:pt-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2.5 sm:mb-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-pill bg-orange-50 inline-flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-orange-600" />
                    </div>
                    <div className="flex flex-col items-end text-right flex-shrink-0">
                      <span className="text-h2 sm:text-h1 font-extrabold text-orange-600 leading-none">
                        ₹{card.discountedPrice.toLocaleString("en-IN")}
                      </span>
                      {showStrike && (
                        <span className="mt-1 inline-flex items-center gap-1.5 leading-none">
                          <span className="text-caption sm:text-body-sm text-ink-400 line-through">
                            ₹{card.price.toLocaleString("en-IN")}
                          </span>
                          {card.discountPct > 0 && (
                            <span className="text-caption font-bold text-orange-600">
                              {card.discountPct}% off
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="text-body sm:text-h3 text-ink-900 font-bold leading-snug mb-2 line-clamp-2">
                      <Link
                        href={card.href}
                        className="hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        {card.name}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-caption sm:text-meta">
                      <span className="inline-flex items-center gap-1 text-ink-600">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" />
                        Reports in {report}
                      </span>
                      <span aria-hidden className="text-ink-300">
                        ·
                      </span>
                      <span className="font-semibold text-orange-700">
                        {card.kind}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-cream-line mb-3 mt-3" />

                  <div className="flex items-center gap-2">
                    <BookNowButton
                      item={{
                        id: card.id,
                        name: card.name,
                        price: card.discountedPrice,
                        originalPrice:
                          card.price > card.discountedPrice
                            ? card.price
                            : undefined,
                        href: card.href,
                        kind: card.kind,
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-pill bg-orange-500 text-white font-semibold text-caption sm:text-body-sm shadow-glow-orange hover:bg-orange-600 transition-all duration-200 active:scale-[0.97]"
                    >
                      <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white flex-shrink-0" />
                      Book now
                    </BookNowButton>
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-0.5 text-caption sm:text-body-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors focus-visible:outline-none focus-visible:underline group/link"
                    >
                      Details
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
