"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  function step(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const tile = el.querySelector<HTMLElement>("[data-tile]");
    const amount = tile ? tile.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  }

  // Auto-advance to the right, looping back to the start. Only runs while the
  // track is actually scrollable (i.e. the mobile/tablet carousel layout) and
  // pauses on hover.
  useEffect(() => {
    if (items.length <= 1) return;
    const el = trackRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      if (el.scrollWidth <= el.clientWidth + 8) return; // desktop grid — skip
      const tile = el.querySelector<HTMLElement>("[data-tile]");
      const amount = tile ? tile.offsetWidth + 16 : el.clientWidth * 0.8;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: amount, behavior: "smooth" });
      }
    }, 3500);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div>
      <div
        ref={trackRef}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hidden pb-2 -mx-1 px-1 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible"
      >
        {items.map((c, i) => {
          const tone = TILE_TONES[i % TILE_TONES.length];
          return (
            <Link
              key={c.id}
              data-tile
              href={c.href}
              className={cn(
                "group relative snap-start flex-shrink-0 w-[62%] sm:w-[40%] lg:w-auto block aspect-square rounded-2xl overflow-hidden text-white shadow-sh-2 hover:shadow-glow-orange hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-bg",
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

              <div className="relative h-full p-5 flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cream-card shadow-sh-2 inline-flex items-center justify-center overflow-hidden">
                  {c.icon && c.icon.length > 0 ? (
                    <Image
                      src={c.icon}
                      alt=""
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  ) : (
                    <Stethoscope className="w-7 h-7 text-orange-600" />
                  )}
                </div>

                <div>
                  <h3 className="text-h3 sm:text-h2 font-bold leading-tight">
                    {c.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-meta font-semibold text-white/90 group-hover:text-white">
                    Explore
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {items.length > 1 && (
        <div className="flex lg:hidden items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
            className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
            className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 border border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
