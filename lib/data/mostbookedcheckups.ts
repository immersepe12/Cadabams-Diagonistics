import mostBookedCheckupsData from "@/data/allpages/_shared/mostbookedcheckups.json";

export interface MostBookedCheckupItem {
  title: string;
  color: string;
  icon: string;
  href: string;
  id: string;
}

export interface MostBookedCheckupsContent {
  title: string;
  description: string;
  viewAllCheckup: string;
  checkups: MostBookedCheckupItem[];
  id: string;
}

export interface MostBookedCheckupsConfig {
  id: string;
  visible: boolean;
  content: MostBookedCheckupsContent;
}

export function getMostBookedCheckups(): MostBookedCheckupsConfig {
  return (mostBookedCheckupsData as MostBookedCheckupsConfig[])[0];
}
