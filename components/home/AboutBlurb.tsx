import { SectionOverline } from "@/components/shared/SectionOverline";

interface AboutBlurbProps {
  title?: string;
  paragraphs: string[];
}

export function AboutBlurb({
  title = "Cadabam's Diagnostics: What Defines Us",
  paragraphs,
}: AboutBlurbProps) {
  if (paragraphs.length === 0) return null;

  return (
    <section className="py-8 lg:py-10 bg-cream-bg">
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="mb-6 pb-4 border-b border-orange-300/60">
          <SectionOverline>About us</SectionOverline>
          <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display">
            {title}
          </h2>
        </div>
        <div className="space-y-4 max-w-4xl text-body text-ink-700 leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
