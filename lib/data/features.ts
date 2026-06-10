import featuresData from "@/data/allpages/_shared/features.json";

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  id: string;
}

export interface FeaturesConfig {
  id: string;
  visible: boolean;
  content: {
    features: FeatureItem[];
    id: string;
  };
}

export function getFeatures(): FeaturesConfig {
  return (featuresData as FeaturesConfig[])[0];
}

export function getFeatureItems(): FeatureItem[] {
  return getFeatures().content.features;
}
