import { TestCard } from "@/components/shared/TestCard";
import { isMeaningfulText } from "@/lib/data/meaningful";
import {
  type LabTest,
  getDiscountedPriceNumber,
  getPriceNumber,
} from "@/lib/data/labtests";
import { labTestUrl } from "@/lib/urls";
import { SectionOverline } from "@/components/shared/SectionOverline";

interface TestGridProps {
  overline?: string;
  title: string;
  tests: LabTest[];
}

export function TestGrid({ overline, title, tests }: TestGridProps) {
  if (tests.length === 0) return null;
  return (
    <section className="py-12 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-gutter">
        {overline && <SectionOverline>{overline}</SectionOverline>}
        <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display">
          {title}
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const original = getPriceNumber(test);
            const discounted = getDiscountedPriceNumber(test);
            return (
              <TestCard
                key={test.id}
                id={test.id}
                kind="Lab Test"
                name={test.testName}
                image={test.basic_info.imageSrc}
                price={discounted || original}
                originalPrice={discounted < original ? original : undefined}
                reportTime={isMeaningfulText(test.basic_info.reportsWithin, 3) ? test.basic_info.reportsWithin : undefined}
                href={labTestUrl(test)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
