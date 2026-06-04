import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface VitalOrganItem {
  id: string;
  name: string;
  image: string;
  href: string;
}

/**
 * Vibrant per-tile gradients, reusing the Radiology section's colour palette
 * so the two sections feel of a piece. The icon always sits on a white disc so
 * the line-art stays crisp and legible on top of the saturated gradient.
 */
export const TILE_TONES = [
  "bg-gradient-to-br from-orange-500 to-orange-700",
  "bg-gradient-to-br from-[#7C6CF0] to-tint-purple-fg",
  "bg-gradient-to-br from-[#4F97F0] to-tint-blue-fg",
  "bg-gradient-to-br from-[#2BB673] to-tint-green-fg",
  "bg-gradient-to-br from-pink-400 to-tint-pink-fg",
  "bg-gradient-to-br from-coral-400 to-tint-peach-fg",
];

export function VitalOrganTile({
  item,
  index,
}: {
  item: VitalOrganItem;
  index: number;
}) {
  const tone = TILE_TONES[index % TILE_TONES.length];
  return (
    <Card
      asChild
      className={cn(
        "group h-full items-center gap-3 rounded-2xl border-transparent p-4 sm:p-5 text-center text-white shadow-sh-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-sh-3 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft focus-visible:ring-white",
        tone,
      )}
    >
      <Link href={item.href}>
        <span className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-pill bg-cream-card shadow-sh-1 ring-2 ring-white/40 transition-transform duration-200 group-hover:scale-105">
          <Image
            src={item.image}
            alt=""
            width={64}
            height={64}
            className="h-9 w-9 sm:h-11 sm:w-11 object-contain"
          />
        </span>

        <span className="text-body-sm sm:text-body font-bold leading-snug text-white">
          {item.name}
        </span>
      </Link>
    </Card>
  );
}
