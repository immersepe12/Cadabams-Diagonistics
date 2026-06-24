import { cn } from "@/lib/utils";

/**
 * Standard promotional discount badges shown on every individual test / scan
 * page (Senior Citizen + Family), mirroring the live site. These are fixed
 * site-wide offers, not per-test data.
 */
const BADGES = [
  {
    emoji: "🎖️",
    label: "Senior",
    text: "Flat 10% off for senior citizens",
  },
  {
    emoji: "👪",
    label: "Family",
    text: "Add a family member for 20% discount",
  },
] as const;

export function DiscountBadges({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none",
        className,
      )}
    >
      {BADGES.map((badge) => (
        <li
          key={badge.label}
          className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/60 px-3.5 py-2.5"
        >
          <span className="text-xl leading-none flex-shrink-0" aria-hidden>
            {badge.emoji}
          </span>
          <div className="min-w-0">
            <p className="text-overline uppercase font-bold text-orange-700 tracking-overline">
              {badge.label}
            </p>
            <p className="text-body-sm text-ink-700 leading-snug">
              {badge.text}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
