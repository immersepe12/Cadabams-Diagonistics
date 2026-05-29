import Link from "next/link";
import { Clock, ShoppingCart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestCardProps {
  name: string;
  /** Kept for API compatibility — currently ignored, no image is rendered. */
  image?: string | null;
  /** Discounted/current price shown prominently. */
  price: number;
  /** Original (struck-through) price, shown only if higher than `price`. */
  originalPrice?: number;
  /** Optional metadata under the title. */
  parameters?: number;
  reportTime?: string;
  /** Full href to the detail page, e.g. /bangalore/lab-test/<slug>. */
  href: string;
  className?: string;
}

export function TestCard({
  name,
  price,
  originalPrice,
  parameters,
  reportTime,
  href,
  className,
}: TestCardProps) {
  const showOriginal =
    typeof originalPrice === "number" && originalPrice > price;
  const discountPct =
    showOriginal && originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <article
      className={cn(
        "group bg-cream-card rounded-xl sm:rounded-2xl border border-cream-line shadow-sh-1 hover:shadow-sh-3 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden h-full",
        className,
      )}
    >
      <div className="p-4 sm:p-5 flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-body sm:text-h3 text-ink-900 font-bold leading-snug line-clamp-2 flex-1 min-w-0">
            <Link
              href={href}
              className="hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:underline"
            >
              {name}
            </Link>
          </h3>
          {discountPct > 0 && (
            <span className="inline-flex items-center rounded-pill bg-coral-400 text-white text-caption font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-sh-1 flex-shrink-0">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {(parameters !== undefined || reportTime) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption sm:text-meta text-ink-500">
            {parameters !== undefined && (
              <span className="inline-flex items-center gap-1">
                <span className="w-1 h-1 rounded-pill bg-ink-300" />
                {parameters} parameters
              </span>
            )}
            {reportTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-ink-400" />
                {reportTime}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 sm:pt-5 border-t border-cream-line-soft space-y-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-h3 sm:text-h2 text-ink-900 font-extrabold leading-tight tracking-tight">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {showOriginal && (
              <span className="text-caption text-ink-400 line-through leading-none">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href="/cart"
              aria-label={`Add ${name} to cart`}
              className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-pill bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-2 py-2 sm:px-3 sm:py-2.5 text-caption sm:text-body-sm border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            >
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Add to cart
            </Link>
            <Link
              href={href}
              aria-label={`Book ${name}`}
              className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-pill bg-gradient-cta text-white font-bold px-2 py-2 sm:px-3 sm:py-2.5 text-caption sm:text-body-sm shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
              Book now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
