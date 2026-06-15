"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerCarouselProps {
  banners: string[];
  /** Optional href to push when "Book now" is clicked from a slide. */
  ctaHrefs?: string[];
  /** Auto-advance interval in ms. Set 0 to disable. Defaults to 5000. */
  intervalMs?: number;
}

export function BannerCarousel({
  banners,
  ctaHrefs = [],
  intervalMs = 5000,
}: BannerCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = banners.length;

  const next = useCallback(
    () => setIndex((i) => (i + 1) % total),
    [total],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );

  useEffect(() => {
    if (intervalMs === 0 || total <= 1) return;
    const id = window.setInterval(next, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, next, total]);

  if (total === 0) return null;

  return (
    <section className="reveal-up py-4 lg:py-6">
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="relative overflow-hidden rounded-2xl shadow-sh-3 bg-cream-card">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {banners.map((src, i) => {
              const cta = ctaHrefs[i];
              const inner = (
                <Image
                  src={src}
                  alt={`Promotion ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              );
              return (
                <div
                  key={src}
                  className="relative flex-shrink-0 w-full aspect-[3659/942] bg-cream-soft"
                  aria-hidden={i !== index}
                >
                  {cta ? (
                    <Link
                      href={cta}
                      aria-label={`Promotion ${i + 1} — book now`}
                      className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous banner"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card/90 text-orange-600 shadow-sh-2 hover:bg-cream-card hover:shadow-sh-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next banner"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card/90 text-orange-600 shadow-sh-2 hover:bg-cream-card hover:shadow-sh-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to banner ${i + 1}`}
                    className={cn(
                      "transition-all duration-200 rounded-pill",
                      i === index
                        ? "w-6 h-2 bg-orange-500"
                        : "w-2 h-2 bg-cream-card/80 hover:bg-cream-card",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
