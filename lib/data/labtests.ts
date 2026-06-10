import labtestsData from "@/data/allpages/_shared/labtests.json";
import labtestCategoriesData from "@/data/allpages/_shared/labtest-categories.json";
import labtestHomepageData from "@/data/allpages/_shared/labtesthomepages.json";
import {
  FAQ,
  InterpretationTable,
  RelativeTestBlock,
  SEO,
  stripLeadingSlash,
} from "./types";

export interface LabTestBasicInfo {
  name: string;
  route: string;
  categoryId: string;
  /** Price stored as number in most rows, string in a few — normalise with `getPriceNumber`. */
  price: number | string;
  discount: string;
  /** Always stored as a "60.00"-style string. */
  discountedPrice: string;
  reportsWithin: string;
  Identifies: string;
  measures: string;
  testId: number | string;
  testCategory?: string;
  imageSrc?: string;
}

export interface LabTestRequisite {
  value: string;
}

export interface LabTest {
  id: string;
  templateName: "labtest";
  testName: string;
  route: string;
  basic_info: LabTestBasicInfo;
  requisites: LabTestRequisite[];
  packages: unknown[];
  faqs: FAQ[];
  interpretations: InterpretationTable;
  relative_test: RelativeTestBlock;
  seo: SEO;
  markdown: string;
}

export interface LabTestCategory {
  id: string;
  name: string;
  tests: string[];
  image: string;
  /** Path stored with leading slash, e.g. "/blood-tests". Use `getCategorySlug` for clean slug. */
  path: string;
  createdAt: string;
  updatedAt: string;
  markdown: string;
}

export interface LabTestHomepageHero {
  title: string;
  subtitle: string;
  imageSrc: string;
}

export interface LabTestHomepageTestCard {
  title: string;
  testCatIds: string[];
  tests: string[];
}

export interface LabTestHomepageHealthMonitoringItem {
  title: string;
  description: string;
  imageSrc: string;
  trustedBy: string;
  testCatId: string;
  test: string;
  id: string;
}

export interface LabTestHomepageMultiTestSection {
  title: string;
  testCatIds: string;
  tests: string[];
  id: string;
}

export interface LabTestHomepageFeature {
  icon: string;
  title: string;
  id: string;
}

export interface LabTestHomepage {
  id: string;
  visible: boolean;
  hero: LabTestHomepageHero;
  test_card: LabTestHomepageTestCard;
  healthMonitoring: { content: LabTestHomepageHealthMonitoringItem[] };
  multiTestSection: LabTestHomepageMultiTestSection[];
  features: LabTestHomepageFeature[];
  discountOffer: { content: { title: string; code: string } };
  banner: string[];
}

const ALL_TESTS: LabTest[] = labtestsData as LabTest[];
const ALL_CATEGORIES: LabTestCategory[] =
  labtestCategoriesData as LabTestCategory[];

export function getAllLabTests(): LabTest[] {
  return ALL_TESTS;
}

export function getAllLabTestSlugs(): string[] {
  return ALL_TESTS.map((t) => stripLeadingSlash(t.route));
}

export function getLabTestBySlug(slug: string): LabTest | undefined {
  const target = stripLeadingSlash(slug);
  return ALL_TESTS.find((t) => stripLeadingSlash(t.route) === target);
}

export function getLabTestById(id: string): LabTest | undefined {
  return ALL_TESTS.find((t) => t.id === id);
}

export function getLabTestsByIds(ids: string[]): LabTest[] {
  const byId = new Map(ALL_TESTS.map((t) => [t.id, t] as const));
  return ids.map((id) => byId.get(id)).filter((t): t is LabTest => Boolean(t));
}

export function getAllLabTestCategories(): LabTestCategory[] {
  return ALL_CATEGORIES;
}

export function getLabTestCategoryById(
  id: string,
): LabTestCategory | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

export function getCategorySlug(category: LabTestCategory): string {
  return stripLeadingSlash(category.path);
}

export function getLabTestCategoryBySlug(
  slug: string,
): LabTestCategory | undefined {
  const target = stripLeadingSlash(slug);
  return ALL_CATEGORIES.find((c) => stripLeadingSlash(c.path) === target);
}

export function getAllLabTestCategorySlugs(): string[] {
  return ALL_CATEGORIES.map(getCategorySlug);
}

export function getLabTestsByCategoryId(categoryId: string): LabTest[] {
  return ALL_TESTS.filter((t) => t.basic_info.categoryId === categoryId);
}

export function getLabTestHomepage(): LabTestHomepage {
  return (labtestHomepageData as LabTestHomepage[])[0];
}

/** Parse `basic_info.price` (number | string) into a number, falling back to 0. */
export function getPriceNumber(test: LabTest): number {
  const raw = test.basic_info.price;
  if (typeof raw === "number") return raw;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/** Parse `basic_info.discountedPrice` (string "660.00") into a number, falling back to price. */
export function getDiscountedPriceNumber(test: LabTest): number {
  const n = Number(test.basic_info.discountedPrice);
  return Number.isFinite(n) ? n : getPriceNumber(test);
}
