"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
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
  intervalMs?: number;
}

const FALLBACK = "/shared/image-1727884059139-383535423.webp";

export function HealthCheckupSlider({
  title = "Health monitoring",
  overline = "Premium checkups",
  cards,
  intervalMs = 0,
}: HealthCheckupSliderProps) {
  const [index, setIndex] = useState(0);
  const total = cards.length;

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

  const current = cards[index]!;
  const showStrike =
    current.price > 0 &&
    current.discountedPrice > 0 &&
    current.price > current.discountedPrice;
  const src =
    current.imageSrc && current.imageSrc.length > 0
      ? current.imageSrc
      : FALLBACK;

  return (
    <section className="py-12 lg:py-20 bg-cream-bg">
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-overline uppercase text-orange-600 font-bold">
            {overline}
          </p>
          <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display mt-2">
            {title}
          </h2>
        </div>

        <div className="relative">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10 items-center">
            <article className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line p-6 lg:p-8 flex flex-col gap-5">
              <p className="text-overline uppercase text-orange-600 font-bold">
                Premium checkup
              </p>
              <h3 className="text-h2 text-ink-900 font-bold leading-tight">
                {current.title}
              </h3>

              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-display-2 font-extrabold text-orange-600">
                  ₹{current.discountedPrice.toLocaleString("en-IN")}
                </span>
                {showStrike && (
                  <span className="text-body text-ink-400 line-through">
                    ₹{current.price.toLocaleString("en-IN")}
                  </span>
                )}
                {current.discountPct > 0 && (
                  <span className="text-meta font-semibold text-orange-700 bg-orange-100 rounded-pill px-2.5 py-0.5">
                    {current.discountPct}% off
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-body-sm">
                <span className="inline-flex items-center gap-2 text-ink-600">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Reports {current.reportsWithin}
                </span>
                <span className="text-meta font-medium text-orange-700 bg-orange-50 rounded-pill px-3 py-1">
                  Lab Test
                </span>
              </div>

              <div className="flex gap-3 mt-2">
                <Link
                  href={current.detailHref}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-md text-body-sm font-semibold border border-orange-500 text-orange-600 hover:bg-orange-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  View details
                </Link>
                <AddToCartButton
                  item={{
                    id: current.id,
                    name: current.title,
                    price: current.discountedPrice,
                    originalPrice: showStrike ? current.price : undefined,
                    href: current.detailHref,
                    kind: "Lab Test",
                  }}
                  label="Add to cart"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-body-sm font-semibold bg-orange-500 text-white shadow-glow-orange hover:bg-orange-600 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                />
              </div>
            </article>

            <div className="text-center lg:text-left space-y-4">
              <h3 className="text-h1 font-display text-ink-900 leading-tight">
                {current.title}
              </h3>
              <p className="text-body text-ink-600 leading-relaxed">
                {current.description}
              </p>
              <div className="inline-flex items-center gap-2 text-body-sm text-ink-700 bg-orange-50 rounded-pill px-3 py-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Trusted by {current.trustedBy}
              </div>
            </div>

            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 w-full">
              <Image
                src={src}
                alt={current.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 60vw, 400px"
              />
            </div>
          </div>

          {total > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 shadow-sh-2 hover:shadow-sh-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {cards.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to checkup ${i + 1}`}
                    className={cn(
                      "transition-all duration-200 rounded-pill",
                      i === index
                        ? "w-6 h-2 bg-orange-500"
                        : "w-2 h-2 bg-ink-300 hover:bg-ink-400",
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card text-orange-600 shadow-sh-2 hover:shadow-sh-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
