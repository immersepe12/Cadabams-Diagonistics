import vitalOrgansData from "@/data/allpages/_shared/vitalorgans.json";

export interface VitalOrgansContent {
  title: string;
  description: string;
  all_test_categories: string[];
  id: string;
}

export interface VitalOrgansConfig {
  id: string;
  visible: boolean;
  content: VitalOrgansContent;
}

export function getVitalOrgans(): VitalOrgansConfig {
  return (vitalOrgansData as VitalOrgansConfig[])[0];
}
