"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqListItem {
  question: string;
  answer: string;
}

interface FaqListProps {
  items: FaqListItem[];
  /** Index of the initially-open item. Set to null to start fully collapsed. Default 0. */
  defaultOpen?: number | null;
  /** Stable prefix for aria-controls ids when multiple FaqLists exist on a page. */
  idPrefix?: string;
  className?: string;
}

export function FaqList({
  items,
  defaultOpen = 0,
  idPrefix = "faq",
  className,
}: FaqListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  if (items.length === 0) return null;

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const numeral = String(i + 1).padStart(2, "0");
        return (
          <li key={i}>
            <article
              className={cn(
                "group relative bg-cream-card rounded-sm border transition-all duration-200 overflow-hidden",
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
                aria-controls={`${idPrefix}-panel-${i}`}
                id={`${idPrefix}-trigger-${i}`}
                className="w-full flex items-center gap-4 sm:gap-5 px-5 sm:px-6 py-4 sm:py-5 text-left focus-visible:outline-none focus-visible:bg-cream-soft transition-colors duration-150"
              >
                <span
                  className={cn(
                    "flex-shrink-0 font-display text-h3 sm:text-h2 font-extrabold tracking-tight transition-colors duration-200 leading-none",
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
                      ? "bg-orange-500 text-white shadow-glow-orange"
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
                id={`${idPrefix}-panel-${i}`}
                role="region"
                aria-labelledby={`${idPrefix}-trigger-${i}`}
                hidden={!isOpen}
                className="px-5 sm:px-6 pb-5"
              >
                <div className="pl-0 sm:pl-[3.25rem] text-body-sm sm:text-body text-ink-600 leading-relaxed border-t border-cream-line pt-4 whitespace-pre-line">
                  {item.answer}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
