import herosData from "@/data/allpages/_shared/heros.json";

export interface HeroButton {
  text: string;
  href: string;
  icon: string;
  id: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  buttonText: string;
  imageSrc: string;
  buttons: HeroButton[];
  id: string;
}

export interface HeroConfig {
  id: string;
  visible: boolean;
  content: HeroContent;
}

export function getHero(): HeroConfig {
  return (herosData as HeroConfig[])[0];
}
