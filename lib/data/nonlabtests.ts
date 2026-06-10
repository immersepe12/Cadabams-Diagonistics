import nonlabtestsData from "@/data/allpages/_shared/nonlabtests.json";
import nonlabtestCategoriesData from "@/data/allpages/_shared/nonlabtest-categories.json";
import {
  FAQ,
  InterpretationTable,
  RelativeTestBlock,
  SEO,
  stripLeadingSlash,
} from "./types";

export interface NonLabTestBasicInfo {
  name: string;
  route: string;
  categoryId: string;
  price: number | string;
  alsoKnownAs?: string;
  discount: string;
  discountedPrice: string;
  reportsWithin: string;
  Identifies: string;
  measures: string;
  testId: number | string;
  testCategory?: string;
  imageSrc?: string;
}

export interface NonLabTest {
  id: string;
  templateName: "non-labtest";
  testName: string;
  route: string;
  basic_info: NonLabTestBasicInfo;
  requisites: { value: string }[];
  interpretations: InterpretationTable;
  faqs: FAQ[];
  relative_test: RelativeTestBlock;
  seo: SEO;
  markdown?: string;
}

/** Some non-lab-test categories also embed extra config + a markdown body. */
export interface NonLabTestCategory {
  id: string;
  name: string;
  tests: string[];
  image: string;
  /** Sometimes "preventive-health-checks", sometimes "/blood-tests" — normalise with `getNonLabCategorySlug`. */
  path: string;
  createdAt: string;
  updatedAt: string;
  allData?: {
    categoryId: string;
    requisites: { value: string }[];
    interpretations: InterpretationTable;
    faqs: FAQ[];
    relative_test: RelativeTestBlock;
    seo?: SEO;
  };
  markdown?: string;
}

const ALL_TESTS: NonLabTest[] = nonlabtestsData as NonLabTest[];
const ALL_CATEGORIES: NonLabTestCategory[] =
  nonlabtestCategoriesData as NonLabTestCategory[];

export function getAllNonLabTests(): NonLabTest[] {
  return ALL_TESTS;
}

export function getAllNonLabTestSlugs(): string[] {
  return ALL_TESTS.map((t) => stripLeadingSlash(t.route));
}

export function getNonLabTestBySlug(slug: string): NonLabTest | undefined {
  const target = stripLeadingSlash(slug);
  return ALL_TESTS.find((t) => stripLeadingSlash(t.route) === target);
}

export function getNonLabTestById(id: string): NonLabTest | undefined {
  return ALL_TESTS.find((t) => t.id === id);
}

export function getNonLabTestsByIds(ids: string[]): NonLabTest[] {
  const byId = new Map(ALL_TESTS.map((t) => [t.id, t] as const));
  return ids
    .map((id) => byId.get(id))
    .filter((t): t is NonLabTest => Boolean(t));
}

export function getAllNonLabTestCategories(): NonLabTestCategory[] {
  return ALL_CATEGORIES;
}

export function getNonLabTestCategoryById(
  id: string,
): NonLabTestCategory | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

export function getNonLabCategorySlug(category: NonLabTestCategory): string {
  return stripLeadingSlash(category.path);
}

export function getNonLabTestCategoryBySlug(
  slug: string,
): NonLabTestCategory | undefined {
  const target = stripLeadingSlash(slug);
  return ALL_CATEGORIES.find((c) => stripLeadingSlash(c.path) === target);
}

export function getAllNonLabTestCategorySlugs(): string[] {
  return ALL_CATEGORIES.map(getNonLabCategorySlug);
}

export function getNonLabTestsByCategoryId(categoryId: string): NonLabTest[] {
  return ALL_TESTS.filter((t) => t.basic_info.categoryId === categoryId);
}

export function getNonLabPriceNumber(test: NonLabTest): number {
  const raw = test.basic_info.price;
  if (typeof raw === "number") return raw;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export function getNonLabDiscountedPriceNumber(test: NonLabTest): number {
  const n = Number(test.basic_info.discountedPrice);
  return Number.isFinite(n) ? n : getNonLabPriceNumber(test);
}
