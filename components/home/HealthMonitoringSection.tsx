import Image from "next/image";
import Link from "next/link";
import { SectionOverline } from "@/components/shared/SectionOverline";
import type { HomeHealthMonitoringItem } from "@/lib/data/homepages";
import { getLabTestById } from "@/lib/data/labtests";
import { labTestUrl } from "@/lib/urls";

interface HealthMonitoringSectionProps {
  items: HomeHealthMonitoringItem[];
}

const FALLBACK = "/shared/image-1727884059139-383535423.webp";

export function HealthMonitoringSection({
  items,
}: HealthMonitoringSectionProps) {
  if (items.length === 0) return null;
  return (
    <section className="py-12 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-gutter">
        <SectionOverline>Health monitoring</SectionOverline>
        <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display">
          Stay ahead of your health
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const test = getLabTestById(item.test);
            const href = test ? labTestUrl(test) : "#";
            const src =
              item.imageSrc && item.imageSrc.length > 0
                ? item.imageSrc
                : FALLBACK;
            return (
              <li key={item.id}>
                <Link
                  href={href}
                  className="group block bg-cream-card rounded-md shadow-sh-2 hover:shadow-sh-3 transition-shadow duration-200 overflow-hidden h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={src}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-h3 text-ink-900 font-bold group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-body-sm text-ink-600 line-clamp-3">
                      {item.description}
                    </p>
                    <p className="mt-3 text-meta text-orange-600 font-semibold">
                      Trusted by {item.trustedBy}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
