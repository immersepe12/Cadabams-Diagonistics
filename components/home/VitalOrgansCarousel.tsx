"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface VitalOrganItem {
  id: string;
  name: string;
  image: string;
  href: string;
}

export function VitalOrgansCarousel({ items }: { items: VitalOrganItem[] }) {
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
  // track is actually scrollable (mobile/tablet layout); pauses on hover.
  useEffect(() => {
    if (items.length <= 1) return;
    const el = trackRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      if (el.scrollWidth <= el.clientWidth + 8) return;
      const tile = el.querySelector<HTMLElement>("[data-tile]");
      const amount = tile ? tile.offsetWidth + 16 : el.clientWidth * 0.8;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: amount, behavior: "smooth" });
      }
    }, 3000);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div>
      <div
        ref={trackRef}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hidden pt-2 pb-2 -mx-1 px-1 lg:mx-0 lg:px-0 lg:py-0 lg:grid lg:grid-cols-6 lg:overflow-visible"
      >
        {items.map((cat) => (
          <Link
            key={cat.id}
            data-tile
            href={cat.href}
            className="group snap-start flex-shrink-0 w-[38%] sm:w-[24%] lg:w-auto flex flex-col items-center gap-3 focus-visible:outline-none"
          >
            <div className="relative w-24 h-24 rounded-pill bg-cream-card shadow-sh-2 group-hover:shadow-glow-orange group-hover:-translate-y-1 transition-all duration-200 flex items-center justify-center overflow-hidden border-2 border-cream-line group-hover:border-orange-300">
              <Image
                src={cat.image}
                alt=""
                width={56}
                height={56}
                className="object-contain w-14 h-14"
              />
            </div>
            <span className="text-body-sm font-semibold text-ink-900 group-hover:text-orange-600 transition-colors text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      {items.length > 1 && (
        <div className="flex lg:hidden items-center justify-center gap-3 mt-5">
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
