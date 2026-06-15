import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export interface VitalOrganItem {
  id: string;
  name: string;
  image: string;
  href: string;
}

export function VitalOrganTile({
  item,
}: {
  item: VitalOrganItem;
  /** Kept for call-site compatibility; tiles no longer vary by index. */
  index?: number;
}) {
  return (
    <Card
      asChild
      className="group h-full items-center gap-3 rounded-2xl border border-cream-line bg-cream-card p-4 sm:p-5 text-center shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-card-hover motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft focus-visible:ring-orange-500"
    >
      <Link href={item.href}>
        <span className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-pill bg-orange-100 text-orange-600 transition-transform duration-200 group-hover:scale-105">
          <Image
            src={item.image}
            alt=""
            width={64}
            height={64}
            className="h-9 w-9 sm:h-11 sm:w-11 object-contain"
          />
        </span>

        <span className="text-body-sm sm:text-body font-bold leading-snug text-ink-900">
          {item.name}
        </span>
      </Link>
    </Card>
  );
}
