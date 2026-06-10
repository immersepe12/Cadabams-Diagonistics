import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { BookNowButton } from "@/components/shared/BookNowButton";

export interface TestCardProps {
  /** Stable id of the test/scan, used as the cart key. */
  id?: string;
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
  /** "Lab Test" | "Radiology" — stored with the cart item. */
  kind?: string;
  className?: string;
}

export function TestCard({
  id,
  name,
  price,
  originalPrice,
  parameters,
  href,
  kind,
  className,
}: TestCardProps) {
  const showOriginal =
    typeof originalPrice === "number" && originalPrice > price;

  return (
    <article
      className={cn(
        "group bg-cream-card rounded-xl sm:rounded-2xl border border-cream-line shadow-sh-1 hover:shadow-sh-3 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden h-full",
        className,
      )}
    >
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-body-sm sm:text-body text-ink-900 font-bold leading-snug flex items-center min-h-[2.75em] flex-1 min-w-0">
            <Link
              href={href}
              className="line-clamp-2 hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:underline"
            >
              {name}
            </Link>
          </h3>
          <div className="flex flex-col items-end flex-shrink-0 text-right">
            <span className="text-h3 text-ink-900 font-extrabold leading-none tracking-tight">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {showOriginal && (
              <span className="mt-1 text-caption text-ink-400 line-through leading-none">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {parameters !== undefined && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption sm:text-meta text-ink-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-1 h-1 rounded-pill bg-ink-300" />
              {parameters} parameters
            </span>
          </div>
        )}

        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2">
            <BookNowButton
              item={{ id: id ?? href, name, price, originalPrice, href, kind }}
              className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-pill bg-gradient-cta text-white font-bold px-2.5 py-2.5 text-body-sm whitespace-nowrap hover:brightness-110 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            >
              <Zap className="w-3.5 h-3.5 fill-white flex-shrink-0" />
              Book now
            </BookNowButton>
            <AddToCartButton
              item={{ id: id ?? href, name, price, originalPrice, href, kind }}
              className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-pill bg-cream-card hover:bg-orange-50 text-ink-900 hover:text-orange-700 font-semibold px-2.5 py-2.5 text-body-sm whitespace-nowrap border border-cream-line hover:border-orange-300 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
