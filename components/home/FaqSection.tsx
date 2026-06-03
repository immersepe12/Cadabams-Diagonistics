"use client";

import Link from "next/link";
import { useState } from "react";
import { HelpCircle, Minus, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  /** ID of the section, for use as deep-link target / nav reference. */
  id?: string;
}

export function FaqSection({ items, id = "faq" }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section
      id={id}
      className="relative overflow-hidden py-8 lg:py-12 bg-cream-bg"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-32 w-96 h-96 rounded-pill bg-gradient-to-br from-orange-200/40 to-coral-300/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 w-80 h-80 rounded-pill bg-gradient-to-tr from-pink-200/30 to-orange-200/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-gutter grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
        <div className="md:sticky md:top-24 md:self-start space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 rounded-pill px-3.5 py-1.5">
            <HelpCircle className="w-4 h-4" />
            <span className="text-meta font-bold uppercase tracking-[0.08em]">
              Help center
            </span>
          </div>

          <h2 className="text-h1 sm:text-display-2 lg:text-display-1 text-ink-900 font-display leading-[1.1]">
            Frequently asked{" "}
            <span className="relative inline-block text-orange-600">
              questions
              <span
                aria-hidden
                className="absolute left-0 bottom-1 w-full h-2.5 bg-orange-200/70 -z-10 rounded-sm"
              />
            </span>
          </h2>

          <p className="text-body text-ink-600 leading-relaxed max-w-md">
            Quick answers about tests, scans, results, and home sample
            collection across Bangalore.
          </p>

          <div className="rounded-2xl bg-cream-card border border-cream-line shadow-sh-2 p-5 max-w-md">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-pill bg-gradient-cta text-white inline-flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </span>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-ink-900">
                  Still have questions?
                </p>
                <p className="text-meta text-ink-600 mt-0.5">
                  Our team usually replies within an hour.
                </p>
              </div>
            </div>
            <Link
              href="#contact"
              className="mt-4 inline-flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-pill px-5 py-2.5 text-body-sm shadow-glow-orange transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Talk to our team
            </Link>
          </div>
        </div>

        <ul className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const numeral = String(i + 1).padStart(2, "0");
            return (
              <li key={i}>
                <article
                  className={cn(
                    "group relative bg-cream-card rounded-2xl border transition-all duration-200 overflow-hidden",
                    isOpen
                      ? "border-orange-200 shadow-sh-3"
                      : "border-cream-line shadow-sh-1 hover:shadow-sh-2 hover:border-orange-100",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-200",
                      isOpen ? "bg-orange-500" : "bg-transparent",
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="w-full flex items-center gap-4 sm:gap-6 px-5 sm:px-6 py-5 text-left focus-visible:outline-none focus-visible:bg-cream-soft transition-colors duration-150"
                  >
                    <span
                      className={cn(
                        "flex-shrink-0 font-display text-h2 sm:text-h1 font-extrabold tracking-tight transition-colors duration-200",
                        isOpen ? "text-orange-500" : "text-ink-300",
                      )}
                    >
                      {numeral}
                    </span>

                    <h3
                      className={cn(
                        "flex-1 text-body sm:text-h3 font-semibold leading-snug transition-colors duration-200",
                        isOpen ? "text-orange-700" : "text-ink-900",
                      )}
                    >
                      {item.question}
                    </h3>

                    <span
                      aria-hidden
                      className={cn(
                        "flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-pill inline-flex items-center justify-center transition-all duration-200",
                        isOpen
                          ? "bg-orange-500 text-white shadow-glow-orange rotate-0"
                          : "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
                      )}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    hidden={!isOpen}
                    className="px-5 sm:px-6 pb-5"
                  >
                    <div className="pl-0 sm:pl-[3.5rem] text-body-sm sm:text-body text-ink-600 leading-relaxed border-t border-cream-line pt-4">
                      {item.answer}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
