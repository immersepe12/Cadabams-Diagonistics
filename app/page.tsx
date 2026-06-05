import type { Metadata } from "next";
import { getHomepage } from "@/lib/data/homepages";
import {
  getDiscountedPriceNumber,
  getLabTestById,
  getLabTestsByIds,
  getPriceNumber,
} from "@/lib/data/labtests";
import {
  getAllNonLabTestCategories,
  getNonLabTestCategoryById,
} from "@/lib/data/nonlabtests";
import { getAllCenters, getCenterShortName } from "@/lib/data/centers";
import { getNavbar } from "@/lib/data/navbars";
import { centerUrl, labTestUrl } from "@/lib/urls";

import { HeroSection } from "@/components/home/HeroSection";
import {
  FeaturedTestsSlider,
  type FeaturedTestCard,
} from "@/components/home/FeaturedTestsSlider";
import { MostBookedCheckupsSection } from "@/components/home/MostBookedCheckupsSection";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import {
  HealthCheckupSlider,
  type HealthCheckupCard,
} from "@/components/home/HealthCheckupSlider";
import { VitalBodyOrgans } from "@/components/home/VitalBodyOrgans";
import { FaqSection, type FaqItem } from "@/components/home/FaqSection";
import { ContactFormSection } from "@/components/home/ContactFormSection";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Cadabam's Diagnostics | Best Diagnostic Center in Bangalore",
  description:
    "Cadabam's Diagnostics offers comprehensive diagnostic services including blood tests, scans, and health checkups. Book your diagnostic tests online or get home sample collection in Bangalore.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Cadabam's Diagnostics | Best Diagnostic Center in Bangalore",
    description:
      "Cadabam's Diagnostics offers comprehensive diagnostic services including blood tests, scans, and health checkups. Book your diagnostic tests online or get home sample collection in Bangalore.",
    url: "/",
    type: "website",
  },
};

const FAQS: FaqItem[] = [
  {
    question:
      "What types of tests and scans are available at Cadabam's Diagnostics?",
    answer:
      "We offer a comprehensive range of diagnostic services, including lab tests like Complete Blood Count, Liver Function Test, Glucose Fasting, and specialized tests such as Thyroid Profile. Additionally, we provide advanced imaging services like X-rays, MRIs, CT scans, Ultrasounds, and Pregnancy Scans, ensuring a one-stop solution for all your diagnostic needs.",
  },
  {
    question:
      "Do I need to visit the centre for sample collection, or do you offer home collection services?",
    answer:
      "For lab tests, we provide the convenience of home sample collection. Our certified professionals will visit your home at the scheduled time, ensuring a safe and hygienic process. Additionally, we have over 70 sample collection points across Bangalore, making it even easier for you to find a location nearby if you prefer to visit one of our centres.",
  },
  {
    question: "How quickly can I expect my test or scan results?",
    answer:
      "At Cadabam's Diagnostics, we prioritise accuracy and speed. Most lab test results are available within a few hours and are sent directly to you via WhatsApp, email, or through other digital form. For scans, results and reports are generally available within 24 to 48 hours, depending on the type of imaging.",
  },
];

export default function HomePage() {
  const home = getHomepage();
  const navbar = getNavbar();
  const allCenters = getAllCenters();
  const primaryCenter = allCenters[0];
  const visitCenters = allCenters.map((c) => ({
    name: getCenterShortName(c),
    address: c.center_info.address.replace(/\s+/g, " ").trim(),
    href: centerUrl(c),
    mapUrl: c.center_info.map_location,
  }));

  const featuredCards: FeaturedTestCard[] = getLabTestsByIds(
    home.test_card.tests,
  ).map((test) => {
    const price = getPriceNumber(test);
    const discountedPrice = getDiscountedPriceNumber(test);
    const stated = Number(test.basic_info.discount);
    const computed =
      price > discountedPrice
        ? Math.round(((price - discountedPrice) / price) * 100)
        : 0;
    const discountPct = stated > 0 ? stated : computed;
    return {
      id: test.id,
      name: test.testName,
      href: labTestUrl(test),
      reportsWithin: test.basic_info.reportsWithin,
      price,
      discountedPrice,
      discountPct,
      kind: "Lab Test",
    };
  });

  const monitoringCards: HealthCheckupCard[] = home.healthMonitoring.content
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

  const vitalOrgansBlock = home.vitalOrgans[0];
  const vitalOrganCategories = (
    vitalOrgansBlock?.all_test_categories ?? []
  )
    .map((id) => getNonLabTestCategoryById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .filter((c) => c.name.trim().length > 0);

  const fallbackOrganCategories =
    vitalOrganCategories.length > 0
      ? vitalOrganCategories
      : getAllNonLabTestCategories().filter(
          (c) => c.name.trim().length > 0,
        );

  return (
    <main>
      <HeroSection hero={home.hero} features={home.features} />

      <FeaturedTestsSlider
        title={home.test_card.title}
        cards={featuredCards}
      />

      <MostBookedCheckupsSection block={home.mostBookedCheckups} />

      <BannerCarousel banners={home.banner} intervalMs={5000} />

      <HealthCheckupSlider
        title="Stay ahead of your health"
        overline="Premium checkups"
        cards={monitoringCards}
      />

      {vitalOrgansBlock && (
        <VitalBodyOrgans
          title={vitalOrgansBlock.title}
          description={vitalOrgansBlock.description}
          categories={fallbackOrganCategories}
        />
      )}

      <FaqSection items={FAQS} />

      <ContactFormSection
        logo={navbar.content.logo}
        phone={primaryCenter?.center_info.phone.split(",")[0]?.trim()}
        email={primaryCenter?.center_info.email}
        centers={visitCenters}
      />
    </main>
  );
}
