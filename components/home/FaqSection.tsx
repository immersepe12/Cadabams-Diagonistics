import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

      <div className="relative mx-auto max-w-6xl px-gutter grid items-start gap-8 md:gap-12 md:grid-cols-[1fr_1.4fr]">
        {/* Intro */}
        <div className="space-y-4 md:self-start">
          <p className="text-overline uppercase text-orange-600 font-bold tracking-overline">
            FAQ&apos;s
          </p>
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
          <p className="max-w-md text-body text-ink-600 leading-relaxed">
            Quick answers about tests, scans, results, and home sample
            collection across Bangalore.
          </p>

          <div className="flex items-center gap-3 rounded-2xl border border-cream-line bg-cream-card p-4 shadow-sh-1 max-w-md">
            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-pill bg-gradient-cta text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm font-semibold text-ink-900">
                Still have questions?
              </p>
              <p className="text-meta text-ink-600">
                Our team usually replies within an hour.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="flex-shrink-0 inline-flex items-center rounded-pill bg-orange-500 px-4 py-2 text-body-sm font-semibold text-white shadow-glow-orange transition-all duration-200 hover:bg-orange-600 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Ask
            </Link>
          </div>
        </div>

        {/* Questions */}
        <Accordion type="single" collapsible>
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-b border-cream-line"
            >
              <AccordionTrigger className="gap-4 py-4 text-body sm:text-h3 font-semibold text-ink-900 hover:no-underline focus-visible:ring-0 data-[state=open]:text-orange-700 [&_[data-slot=accordion-trigger-icon]]:hidden">
                {item.question}
                <ChevronDown className="ml-auto size-5 shrink-0 text-ink-500 transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger:text-orange-600" />
              </AccordionTrigger>
              <AccordionContent className="max-w-lg pb-4 text-body-sm sm:text-body text-ink-600 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
