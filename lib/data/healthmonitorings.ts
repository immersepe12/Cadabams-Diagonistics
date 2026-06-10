import healthMonitoringsData from "@/data/allpages/_shared/healthmonitorings.json";

export interface HealthMonitoringHealthData {
  type: "checkup" | "labtest" | string;
  name: string;
  duration: string;
  parameter: number;
  price: number;
  discount: string;
  discountedPrice: number;
}

export interface HealthMonitoringItem {
  title: string;
  description: string;
  /** Note: JSON key is `imgageSrc` (with a typo) — preserved here to match source. */
  imgageSrc: string;
  trustedBy: string;
  healthData: HealthMonitoringHealthData[];
  id: string;
}

export interface HealthMonitoringsConfig {
  id: string;
  visible: boolean;
  content: HealthMonitoringItem[];
}

export function getHealthMonitorings(): HealthMonitoringsConfig {
  return (healthMonitoringsData as HealthMonitoringsConfig[])[0];
}

export function getHealthMonitoringItems(): HealthMonitoringItem[] {
  return getHealthMonitorings().content;
}
