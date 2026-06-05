import Link from "next/link";
import {
  ChevronRight,
  Home,
  ShieldCheck,
  Clock,
  Beaker,
  HeartPulse,
} from "lucide-react";
import {
  getAllLabTestCategories,
  getAllLabTests,
  getCategorySlug,
  getDiscountedPriceNumber,
  getLabTestById,
  getLabTestCategoryById,
  getLabTestHomepage,
  getLabTestsByCategoryId,
  getPriceNumber,
} from "@/lib/data/labtests";
import { labTestUrl } from "@/lib/urls";
import { isMeaningfulText } from "@/lib/data/meaningful";
import {
  LabTestFilter,
  type LabTestCardVM,
  type LabTestCategoryVM,
} from "@/components/labtests/LabTestFilter";
import {
  HealthCheckupSlider,
  type HealthCheckupCard,
} from "@/components/home/HealthCheckupSlider";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { TrustBadges } from "@/components/shared/TrustBadges";

const TRUST_POINTS = [
  { Icon: ShieldCheck, label: "NABL Accredited Labs" },
  { Icon: Clock, label: "Reports in 6 hours" },
  { Icon: HeartPulse, label: "Free Home Collection" },
  { Icon: Beaker, label: "1500+ Tests Available" },
] as const;

interface LabTestListingProps {
  /** When set, the listing opens pre-filtered to this category slug. */
  initialCategorySlug?: string;
}

export function LabTestListing({ initialCategorySlug }: LabTestListingProps) {
  const allTests = getAllLabTests();

  const categorySlugById = new Map(
    getAllLabTestCategories().map((c) => [c.id, getCategorySlug(c)] as const),
  );

  const categories = getAllLabTestCategories()
    .filter((c) => c.name.trim().length > 0)
    .map((c) => ({ ...c, count: getLabTestsByCategoryId(c.id).length }))
    .filter((c) => c.count > 0);

  const categoryVMs: LabTestCategoryVM[] = categories.map((c) => ({
    slug: getCategorySlug(c),
    name: c.name,
    count: c.count,
  }));

  const activeCategory = initialCategorySlug
    ? categoryVMs.find((c) => c.slug === initialCategorySlug) ?? null
    : null;

  // Build fully serialisable card view-models so all filtering can happen
  // client-side without re-fetching from the server.
  const testCards: LabTestCardVM[] = allTests.map((test) => {
    const price = getPriceNumber(test);
    const discounted = getDiscountedPriceNumber(test);
    const categoryImage = getLabTestCategoryById(
      test.basic_info.categoryId,
    )?.image;
    return {
      id: test.id,
      name: test.testName,
      image: test.basic_info.imageSrc || categoryImage || null,
      price: discounted || price,
      originalPrice: discounted > 0 && discounted < price ? price : undefined,
      reportTime: isMeaningfulText(test.basic_info.reportsWithin, 3)
        ? test.basic_info.reportsWithin
        : undefined,
      href: labTestUrl(test),
      categorySlug: categorySlugById.get(test.basic_info.categoryId) ?? null,
      searchText: [
        test.testName,
        test.basic_info.name,
        test.basic_info.testCategory ?? "",
      ]
        .join(" ")
        .toLowerCase(),
    };
  });

  const homepage = getLabTestHomepage();
  const healthCheckupCards: HealthCheckupCard[] = (
    homepage?.healthMonitoring?.content ?? []
  )
    .map((item) => {
      const test = getLabTestById(item.test);
      if (!test) return null;
      const price = getPriceNumber(test);
      const discountedPrice = getDiscountedPriceNumber(test);
      const stated = Number(test.basic_info.discount);
      const computed =
        price > discountedPrice
          ? Math.round(((price - discountedPrice) / price) * 100)
          : 0;
      const discountPct = stated > 0 ? stated : computed;
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        imageSrc: item.imageSrc,
        trustedBy: item.trustedBy,
        reportsWithin: test.basic_info.reportsWithin,
        price,
        discountedPrice,
        discountPct,
        detailHref: labTestUrl(test),
      };
    })
    .filter((c): c is HealthCheckupCard => c !== null);
  const banners = homepage?.banner ?? [];

  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-pill bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-pill bg-coral-400/30 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-gutter pt-4 pb-8 sm:pt-5 sm:pb-10 lg:pt-6 lg:pb-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-meta text-white/80 mb-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
            <Link href="/bangalore" className="hover:text-white transition-colors">
              Bangalore
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
            {activeCategory ? (
              <>
                <Link
                  href="/bangalore/lab-test"
                  className="hover:text-white transition-colors"
                >
                  Lab tests
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                <span className="text-white font-semibold">
                  {activeCategory.name}
                </span>
              </>
            ) : (
              <span className="text-white font-semibold">Lab tests</span>
            )}
          </nav>

          <div className="max-w-3xl">
            <p className="text-overline uppercase text-white/80 font-bold mb-2 tracking-overline">
              Lab tests in Bangalore
            </p>
            <h1 className="text-h1 sm:text-display-2 lg:text-[44px] lg:leading-[1.05] font-display font-extrabold mb-3 tracking-tight">
              {activeCategory
                ? `${activeCategory.name} in Bangalore`
                : "Accurate lab tests at the best prices"}
            </h1>
            <p className="text-body-sm sm:text-body lg:text-h3 text-white/90 max-w-2xl leading-relaxed">
              {allTests.length}+ tests across blood, hormones, vitamins, liver,
              kidney, heart and more. Reports in 6 hours. Home sample collection
              available across Bangalore.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-6 lg:-mt-8 mx-auto max-w-7xl px-gutter">
        <TrustBadges
          items={TRUST_POINTS.map(({ Icon, label }) => ({
            icon: <Icon className="w-5 h-5" />,
            label,
          }))}
        />
      </section>

      <section className="mx-auto max-w-7xl px-gutter py-8 lg:py-10">
        <LabTestFilter
          tests={testCards}
          categories={categoryVMs}
          totalCount={allTests.length}
          initialCategorySlug={initialCategorySlug ?? null}
        />
      </section>

      {healthCheckupCards.length > 0 && (
        <HealthCheckupSlider
          title="Stay ahead of your health"
          overline="Premium checkups"
          cards={healthCheckupCards}
        />
      )}

      {banners.length > 0 && <BannerCarousel banners={banners} />}
    </main>
  );
}
