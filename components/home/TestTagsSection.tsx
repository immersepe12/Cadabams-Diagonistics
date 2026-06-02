import Link from "next/link";
import { SectionOverline } from "@/components/shared/SectionOverline";

export interface TestTag {
  id: string;
  name: string;
  href: string;
}

interface TestTagsSectionProps {
  overline?: string;
  title: string;
  tags: TestTag[];
  className?: string;
}

export function TestTagsSection({
  overline,
  title,
  tags,
  className,
}: TestTagsSectionProps) {
  if (tags.length === 0) return null;

  return (
    <section className={className ?? "py-8 lg:py-10 bg-cream-bg"}>
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="mb-6 pb-4 border-b border-orange-300/60">
          {overline && <SectionOverline>{overline}</SectionOverline>}
          <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display">
            {title}
          </h2>
        </div>

        <ul className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <li key={tag.id}>
              <Link
                href={tag.href}
                className="inline-flex items-center px-4 py-2 rounded-pill border border-cream-line bg-cream-card text-body-sm text-ink-700 font-medium hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
