import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHomePage } from "@/lib/data/allpages";

import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedTestsSlider } from "@/components/home/FeaturedTestsSlider";
import { MostBookedCheckupsSection } from "@/components/home/MostBookedCheckupsSection";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { HealthCheckupSlider } from "@/components/home/HealthCheckupSlider";
import { VitalBodyOrgans } from "@/components/home/VitalBodyOrgans";
import { FaqSection } from "@/components/home/FaqSection";
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

export default function HomePage() {
  // Source the home page's data from its route file (data/allpages/page.json).
  const home = getHomePage();
  if (!home) notFound();

  return (
    <main>
      <HeroSection hero={home.hero} features={home.features} />

      <FeaturedTestsSlider
        title={home.featuredTests.title}
        cards={home.featuredTests.cards}
      />

      <MostBookedCheckupsSection block={home.mostBookedCheckups} />

      <BannerCarousel banners={home.banner} intervalMs={5000} />

      <HealthCheckupSlider
        title={home.healthMonitoring.title}
        overline="Premium checkups"
        cards={home.healthMonitoring.cards}
      />

      {home.vitalOrgans && (
        <VitalBodyOrgans
          title={home.vitalOrgans.title}
          description={home.vitalOrgans.description}
          categories={home.vitalOrgans.categories}
        />
      )}

      <FaqSection items={home.faqs} />

      <ContactFormSection
        logo={home.contact.logo}
        phone={home.contact.phone}
        email={home.contact.email}
        centers={home.contact.centers}
      />
    </main>
  );
}
