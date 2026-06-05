"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Users, ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { BookNowButton } from "@/components/shared/BookNowButton";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface HealthCheckupCard {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  trustedBy: string;
  reportsWithin: string;
  price: number;
  discountedPrice: number;
  discountPct: number;
  detailHref: string;
}

interface HealthCheckupSliderProps {
  title?: string;
  overline?: string;
  cards: HealthCheckupCard[];
}

const FALLBACK = "/shared/image-1727884059139-383535423.webp";

export function HealthCheckupSlider({
  title = "Health monitoring",
  overline = "Premium checkups",
  cards,
}: HealthCheckupSliderProps) {
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
    <section className="py-6 sm:py-8 lg:py-10 bg-cream-bg">
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="flex items-end justify-between gap-4 mb-4 lg:mb-5">
          <div>
            <p className="text-overline uppercase text-orange-600 font-bold tracking-overline">
              {overline}
            </p>
            <h2 className="text-h2 sm:text-h1 lg:text-display-2 text-ink-900 font-display font-extrabold mt-1 tracking-tight">
              {title}
            </h2>
          </div>
          {cards.length > 1 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Previous"
                className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sh-1 disabled:hover:border-cream-line"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                disabled={!canNext}
                aria-label="Next"
                className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sh-1 disabled:hover:border-cream-line"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {cards.map((card) => {
              const showStrike =
                card.price > 0 &&
                card.discountedPrice > 0 &&
                card.price > card.discountedPrice;
              const src =
                card.imageSrc && card.imageSrc.length > 0
                  ? card.imageSrc
                  : FALLBACK;
              return (
                <CarouselItem
                  key={card.id}
                  className="pl-3 sm:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/5"
                >
                  <article className="group h-full bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 hover:shadow-sh-3 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
                    <Link
                      href={card.detailHref}
                      aria-label={card.title}
                      className="relative aspect-[4/3] block bg-cream-soft overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
                    >
                      <Image
                        src={src}
                        alt={card.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      {card.discountPct > 0 && (
                        <Badge className="absolute top-2.5 left-2.5 bg-coral-400 text-white shadow-sh-1">
                          {card.discountPct}% OFF
                        </Badge>
                      )}
                    </Link>

                    <div className="p-3 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="flex-1 min-w-0 text-body-sm font-bold text-ink-900 leading-snug line-clamp-2">
                          <Link
                            href={card.detailHref}
                            className="hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:underline"
                          >
                            {card.title}
                          </Link>
                        </h3>
                        <div className="flex flex-col items-end text-right flex-shrink-0">
                          <span className="text-h3 font-extrabold text-ink-900 leading-none tracking-tight">
                            ₹{card.discountedPrice.toLocaleString("en-IN")}
                          </span>
                          {showStrike && (
                            <span className="mt-0.5 text-caption text-ink-400 line-through leading-none">
                              ₹{card.price.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-caption text-ink-500">
                        {card.reportsWithin && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-orange-500" />
                            {card.reportsWithin}
                          </span>
                        )}
                        {card.reportsWithin && card.trustedBy && (
                          <span aria-hidden className="text-ink-300">
                            ·
                          </span>
                        )}
                        {card.trustedBy && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3 h-3 text-orange-500" />
                            {card.trustedBy}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-2.5">
                        <BookNowButton
                          item={{
                            id: card.id,
                            name: card.title,
                            price: card.discountedPrice,
                            originalPrice: showStrike ? card.price : undefined,
                            href: card.detailHref,
                            kind: "Lab Test",
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-pill bg-gradient-cta text-white font-bold px-3 py-2 text-body-sm whitespace-nowrap shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:flex-shrink-0"
                        >
                          Buy now
                          <ArrowRight className="w-4 h-4" />
                        </BookNowButton>
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
