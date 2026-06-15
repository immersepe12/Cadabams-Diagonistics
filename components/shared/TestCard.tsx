import Link from "next/link";
import { Building2, Clock, FlaskConical, Home, Scan, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { titleCaseTestName } from "@/lib/format";
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
  reportTime,
  href,
  kind,
  className,
}: TestCardProps) {
  const showOriginal =
    typeof originalPrice === "number" && originalPrice > price;
  const discountPct = showOriginal
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const isLab = kind === "Lab Test";
  const displayName = titleCaseTestName(name);
  // Category chip — only shown when we know the kind.
  const CategoryIcon = kind ? (isLab ? FlaskConical : Scan) : null;
  const categoryLabel = isLab ? "Lab Test" : "Radiology";

  return (
    <article
      className={cn(
        "group bg-cream-card rounded-xl sm:rounded-2xl border border-cream-line shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden h-full",
        className,
      )}
    >
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 min-w-0">
        {CategoryIcon && (
          <span
            className="inline-flex items-center gap-1 self-start rounded-pill bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 text-caption font-bold uppercase tracking-overline mb-1.5"
            title={categoryLabel}
          >
            <CategoryIcon className="w-3 h-3 flex-shrink-0" />
            {categoryLabel}
          </span>
        )}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-body-sm sm:text-body text-ink-900 font-bold leading-snug flex items-center min-h-[2.75em] flex-1 min-w-0">
            <Link
              href={href}
              className="line-clamp-2 hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:underline"
            >
              {displayName}
            </Link>
          </h3>
          <div className="flex flex-col items-end flex-shrink-0 text-right">
            <span className="text-h3 text-ink-900 font-extrabold leading-none tracking-tight group-hover:text-orange-600 transition-colors">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {showOriginal && (
              <span className="mt-1 text-caption text-ink-400 line-through leading-none">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {reportTime && (
            <span className="inline-flex items-center gap-1 rounded-pill bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 text-caption sm:text-meta font-semibold">
              <Clock className="w-3 h-3 flex-shrink-0" />
              {reportTime}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-pill bg-cream-soft text-ink-600 border border-cream-line px-2 py-0.5 text-caption sm:text-meta font-medium">
            {isLab ? (
              <Home className="w-3 h-3 flex-shrink-0 text-orange-500" />
            ) : (
              <Building2 className="w-3 h-3 flex-shrink-0 text-orange-500" />
            )}
            {isLab ? "Home collection" : "Centre visit"}
          </span>
          {discountPct > 0 && (
            <span className="inline-flex items-center rounded-pill bg-success-bg text-success px-2 py-0.5 text-caption sm:text-meta font-bold">
              Save {discountPct}%
            </span>
          )}
          {parameters !== undefined && (
            <span className="inline-flex items-center gap-1 text-caption sm:text-meta text-ink-500">
              <span className="w-1 h-1 rounded-pill bg-ink-300" />
              {parameters} parameters
            </span>
          )}
        </div>

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
              iconOnly
              item={{ id: id ?? href, name, price, originalPrice, href, kind }}
              className="flex-shrink-0 w-10 h-10 inline-flex items-center justify-center rounded-pill bg-cream-card hover:bg-orange-50 text-ink-700 hover:text-orange-700 border border-cream-line hover:border-orange-300 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:flex-shrink-0 [&.is-added]:bg-orange-50 [&.is-added]:text-orange-700 [&.is-added]:border-orange-300"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
