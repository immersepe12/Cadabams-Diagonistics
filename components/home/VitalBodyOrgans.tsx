import { SectionOverline } from "@/components/shared/SectionOverline";
import type { NonLabTestCategory } from "@/lib/data/nonlabtests";
import { nonLabCategoryUrl } from "@/lib/urls";
import { VitalOrgansCarousel } from "@/components/home/VitalOrgansCarousel";

interface VitalBodyOrgansProps {
  title: string;
  description?: string;
  categories: NonLabTestCategory[];
}

const FALLBACK = "/shared/image-1727884059139-383535423.webp";

export function VitalBodyOrgans({
  title,
  description,
  categories,
}: VitalBodyOrgansProps) {
  if (categories.length === 0) return null;

  const items = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image && cat.image.length > 0 ? cat.image : FALLBACK,
    href: nonLabCategoryUrl(cat.id),
  }));

  return (
    <section className="reveal-up py-8 lg:py-12 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <SectionOverline className="mx-auto inline-block">
            By specialty
          </SectionOverline>
          <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display mt-2">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-body text-ink-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <VitalOrgansCarousel items={items} />
      </div>
    </section>
  );
}
