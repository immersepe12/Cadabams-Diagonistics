import homepagesData from "@/data/allpages/_shared/homepages.json";

export interface HomeHeroButton {
  text: string;
  href: string;
  icon: string;
  id: string;
}

export interface HomeHero {
  title: string;
  subtitle: string;
  imageSrc: string;
  buttons: HomeHeroButton[];
}

export interface HomeTestCard {
  title: string;
  testCatIds: string[];
  tests: string[];
}

export interface HomeVitalOrgansBlock {
  title: string;
  description: string;
  all_test_categories: string[];
  id: string;
}

export interface HomeMostBookedCheckupItem {
  title: string;
  icon: string;
  catid: string;
  href: string;
  id: string;
}

export interface HomeMostBookedCheckups {
  title: string;
  description: string;
  viewAllCheckup: string;
  checkups: HomeMostBookedCheckupItem[];
}

export interface HomeHealthMonitoringItem {
  title: string;
  description: string;
  imageSrc: string;
  trustedBy: string;
  testCatId: string;
  test: string;
  id: string;
}

export interface HomeFeature {
  icon: string;
  title: string;
  id: string;
}

export interface Homepage {
  id: string;
  visible: boolean;
  hero: HomeHero;
  test_card: HomeTestCard;
  vitalOrgans: HomeVitalOrgansBlock[];
  mostBookedCheckups: HomeMostBookedCheckups;
  healthMonitoring: { content: HomeHealthMonitoringItem[] };
  features: HomeFeature[];
  discountOffer: { content: { title: string; code: string } };
  banner: string[];
}

export function getHomepage(): Homepage {
  return (homepagesData as Homepage[])[0];
}
