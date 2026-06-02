import Link from "next/link";
import { ChevronRight, Clock, FlaskConical } from "lucide-react";
import { AddToCartButton } from "@/components/shared/AddToCartButton";

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
          <Link
            href="/bangalore/lab-test"
            className="hidden sm:inline-flex items-center gap-1 text-body-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            See all tests
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {cards.map((card) => {
            const showStrike =
              card.discountPct > 0 && card.price > card.discountedPrice;
            const report = normaliseReportTime(card.reportsWithin);
            return (
              <article
                key={card.id}
                className="group relative bg-cream-card rounded-xl shadow-sh-1 hover:shadow-sh-3 border border-cream-line hover:border-orange-200 transition-all duration-200 overflow-hidden hover:-translate-y-0.5 flex flex-col"
              >
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-cta"
                />

                {card.discountPct > 0 && (
                  <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-orange-500 text-white text-caption sm:text-meta font-bold rounded-pill px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-glow-orange">
                    {card.discountPct}% off
                  </span>
                )}

                <div className="p-3 sm:p-4 lg:p-5 pt-4 sm:pt-5 flex flex-col flex-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-pill bg-orange-50 inline-flex items-center justify-center mb-2.5 sm:mb-3">
                    <FlaskConical className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-orange-600" />
                  </div>

                  <h3 className="text-body sm:text-h3 text-ink-900 font-bold leading-snug mb-2 line-clamp-2">
                    <Link
                      href={card.href}
                      className="hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:underline"
                    >
                      {card.name}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-caption sm:text-meta mb-3">
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

                  <div className="h-px bg-cream-line mb-3" />

                  <div className="flex items-baseline gap-2 mb-3 mt-auto">
                    <span className="text-h2 sm:text-h1 lg:text-display-2 font-extrabold text-orange-600 leading-none">
                      ₹{card.discountedPrice.toLocaleString("en-IN")}
                    </span>
                    {showStrike && (
                      <span className="text-caption sm:text-body-sm text-ink-400 line-through">
                        ₹{card.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <AddToCartButton
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
                      className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-pill bg-orange-500 text-white font-semibold text-caption sm:text-body-sm shadow-glow-orange hover:bg-orange-600 transition-all duration-200 active:scale-[0.97] [&_svg]:w-3 [&_svg]:h-3 sm:[&_svg]:w-3.5 sm:[&_svg]:h-3.5"
                    />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
