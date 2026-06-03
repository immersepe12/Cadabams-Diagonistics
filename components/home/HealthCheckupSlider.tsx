"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, ShieldCheck } from "lucide-react";
import { AddToCartButton } from "@/components/shared/AddToCartButton";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  function updateScrollState() {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  function scroll(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  }

  // Track scroll position so the arrows disable at the start/end.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [cards.length]);

  // Auto-advance: nudge one card every few seconds, looping back to the start
  // at the end. Pauses while the user is hovering the track.
  useEffect(() => {
    if (cards.length <= 1) return;
    const el = trackRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      const card = el.querySelector<HTMLElement>("[data-card]");
      const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3500);
    return () => window.clearInterval(id);
  }, [cards.length]);

  if (cards.length === 0) return null;

  return (
    <section className="py-8 lg:py-12 bg-cream-bg">
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="flex items-end justify-between gap-4 mb-6">
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
                onClick={() => scroll(-1)}
                disabled={!canPrev}
                aria-label="Previous"
                className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sh-1 disabled:hover:border-cream-line"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                disabled={!canNext}
                aria-label="Next"
                className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sh-1 disabled:hover:border-cream-line"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hidden pb-2 -mx-1 px-1"
        >
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
              <article
                key={card.id}
                data-card
                className="snap-start flex-shrink-0 w-[190px] sm:w-[230px] bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 hover:shadow-sh-3 transition-all duration-200 flex flex-col overflow-hidden group"
              >
                <Link
                  href={card.detailHref}
                  aria-label={card.title}
                  className="relative aspect-[16/10] block bg-cream-soft overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="300px"
                  />
                  {card.discountPct > 0 && (
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-pill bg-coral-400 text-white text-caption font-bold px-2.5 py-1 shadow-sh-1">
                      {card.discountPct}% OFF
                    </span>
                  )}
                </Link>

                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-body-sm font-bold text-ink-900 leading-snug line-clamp-2">
                    <Link
                      href={card.detailHref}
                      className="hover:text-orange-600 transition-colors"
                    >
                      {card.title}
                    </Link>
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {card.reportsWithin && (
                      <span className="inline-flex items-center gap-1 rounded-pill bg-cream-soft border border-cream-line text-caption font-medium text-ink-600 px-2 py-0.5">
                        <Clock className="w-3 h-3 text-orange-600" />
                        {card.reportsWithin}
                      </span>
                    )}
                    {card.trustedBy && (
                      <span className="inline-flex items-center gap-1 rounded-pill bg-cream-soft border border-cream-line text-caption font-medium text-ink-600 px-2 py-0.5">
                        <ShieldCheck className="w-3 h-3 text-orange-600" />
                        {card.trustedBy}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-2.5">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-h3 font-extrabold text-ink-900 leading-none tracking-tight">
                        ₹{card.discountedPrice.toLocaleString("en-IN")}
                      </span>
                      {showStrike && (
                        <span className="text-caption text-ink-400 line-through">
                          ₹{card.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <AddToCartButton
                        item={{
                          id: card.id,
                          name: card.title,
                          price: card.discountedPrice,
                          originalPrice: showStrike ? card.price : undefined,
                          href: card.detailHref,
                          kind: "Lab Test",
                        }}
                        label="Add to cart"
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-pill bg-gradient-cta text-white font-bold px-3 py-2 text-body-sm whitespace-nowrap shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:flex-shrink-0"
                      />
                      <Link
                        href={card.detailHref}
                        className="w-full inline-flex items-center justify-center rounded-pill bg-cream-card hover:bg-orange-50 text-ink-900 hover:text-orange-700 font-semibold px-3 py-2 text-body-sm border border-cream-line hover:border-orange-300 transition-all duration-200"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
