import centerPagesData from "@/data/allpages/_shared/centerpages.json";
import { FAQ, SEO, slugifyLocation } from "./types";

export interface CenterBasicInfo {
  center_name: string;
  center_image: string;
  center_sub_title: string;
  location: string;
  city: string;
  area: string;
}

export interface CenterContact {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  map_location: string;
}

export interface CenterWorkingHours {
  weekdays: { start: string; end: string; id: string };
  sunday: { start: string; end: string; id: string };
}

export interface CenterServiceTestRef {
  id: string;
  testName: string;
  route: string;
}

export interface CenterService {
  icon: string;
  title: string;
  description: string;
  tests: CenterServiceTestRef[];
  id: string;
}

export interface CenterTestimonial {
  name: string;
  content: string;
  location: string;
  rating: number;
  date: string | null;
  id: string;
}

export interface CenterTeamMember {
  name: string;
  designation: string;
  experience: string;
  qualification: string;
  image: string;
  id: string;
}

export interface Center {
  id: string;
  templateName: "center";
  basic_info: CenterBasicInfo;
  center_info: CenterContact;
  working_hours: CenterWorkingHours;
  services: CenterService[];
  testimonials: CenterTestimonial[];
  team: CenterTeamMember[];
  faqs: FAQ[];
  seo: SEO;
  markdown: string;
}

const ALL_CENTERS: Center[] = centerPagesData as Center[];

export function getAllCenters(): Center[] {
  return ALL_CENTERS;
}

export function getCenterSlug(center: Center): string {
  return slugifyLocation(center.basic_info.location);
}

/**
 * Short, human-friendly centre name derived from its location/area — e.g.
 * "Banashankari", "Kanakapura Road" — instead of the long marketing
 * `center_name` ("Cadabam's Diagnostic Centre Banashankari"). Used in the
 * header Centers menu where only the locality is wanted.
 */
export function getCenterShortName(center: Center): string {
  const raw =
    center.basic_info.location?.trim() ||
    center.basic_info.area?.trim() ||
    center.basic_info.center_name?.trim() ||
    "";
  return raw
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function getAllCenterSlugs(): string[] {
  return ALL_CENTERS.map(getCenterSlug);
}

export function getCenterBySlug(slug: string): Center | undefined {
  const target = slugifyLocation(slug);
  return ALL_CENTERS.find((c) => getCenterSlug(c) === target);
}

export function getCenterById(id: string): Center | undefined {
  return ALL_CENTERS.find((c) => c.id === id);
}

export function getCentersByCity(city: string): Center[] {
  const target = city.toLowerCase();
  return ALL_CENTERS.filter((c) => c.basic_info.city.toLowerCase() === target);
}
