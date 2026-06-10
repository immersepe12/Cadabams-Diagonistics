import navbarsData from "@/data/allpages/_shared/navbars.json";

export interface NavbarLink {
  text: string;
  href: string;
  id: string;
}

export interface NavbarContent {
  logo: string;
  navigationLinks: NavbarLink[];
  id: string;
}

export interface NavbarConfig {
  id: string;
  visible: boolean;
  content: NavbarContent;
}

export function getNavbar(): NavbarConfig {
  return (navbarsData as NavbarConfig[])[0];
}

export function getNavbarLinks(): NavbarLink[] {
  return getNavbar().content.navigationLinks;
}
