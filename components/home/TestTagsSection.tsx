import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { SectionOverline } from "@/components/shared/SectionOverline";
import { cn } from "@/lib/utils";

export interface TestTag {
  id: string;
  name: string;
  href: string;
}

export type TestTagsVariant = "pill" | "soft" | "rect" | "text" | "column";

interface TestTagsSectionProps {
  overline?: string;
  title: string;
  tags: TestTag[];
  className?: string;
  /** Visual style for the link list. Defaults to "pill". */
  variant?: TestTagsVariant;
}

export function TestTagsSection({
  overline,
  title,
  tags,
  className,
  variant = "pill",
}: TestTagsSectionProps) {
  if (tags.length === 0) return null;

  return (
    <section className={className ?? "py-5 lg:py-6 bg-cream-bg"}>
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="mb-4 pb-3 border-b border-orange-300/60">
          {overline && <SectionOverline>{overline}</SectionOverline>}
          <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display">
            {title}
          </h2>
        </div>

        <TagList tags={tags} variant={variant} />
      </div>
    </section>
  );
}

function TagList({
  tags,
  variant,
}: {
  tags: TestTag[];
  variant: TestTagsVariant;
}) {
  // Column variant: multi-column list with chevrons
  if (variant === "column") {
    return (
      <ul className="columns-2 sm:columns-3 lg:columns-4 gap-x-8">
        {tags.map((tag) => (
          <li key={tag.id} className="break-inside-avoid">
            <Link
              href={tag.href}
              className="group flex items-start gap-1.5 py-1.5 text-body-sm text-ink-700 hover:text-orange-700 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-orange-400 transition-transform group-hover:translate-x-0.5" />
              <span className="min-w-0 break-words">{tag.name}</span>
              <ArrowUpRight
                className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-orange-600 opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // Text variant: plain inline links separated by spacing
  if (variant === "text") {
    return (
      <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link
              href={tag.href}
              className="text-body-sm font-medium text-ink-700 underline-offset-4 decoration-orange-300 hover:text-orange-700 hover:underline transition-colors"
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // pill (current) — rounded pill with leading dot + hover arrow
  if (variant === "pill") {
    return (
      <ul className="flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link
              href={tag.href}
              className="group inline-flex items-center gap-2 rounded-pill border border-cream-line bg-cream-card pl-4 pr-3 py-2 text-body-sm font-medium text-ink-700 shadow-sh-1 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 hover:shadow-sh-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <span
                aria-hidden
                className="w-1.5 h-1.5 rounded-full bg-orange-300 transition-colors group-hover:bg-orange-600"
              />
              {tag.name}
              <ArrowUpRight
                className="w-3.5 h-3.5 -ml-0.5 text-ink-300 opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:text-orange-600 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // soft / rect — plain chip styles sharing one flex-wrap layout
  const chip: Record<"soft" | "rect", string> = {
    soft: "rounded-pill bg-orange-50/70 hover:bg-orange-100 hover:text-orange-700",
    rect: "rounded-md border border-cream-line bg-cream-card hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700",
  };

  return (
    <ul className="flex flex-wrap gap-2.5">
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link
            href={tag.href}
            className={cn(
              "inline-flex items-center px-4 py-2 text-body-sm font-medium text-ink-700 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
              chip[variant as "soft" | "rect"],
            )}
          >
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
