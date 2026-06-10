import blogsData from "@/data/allpages/_shared/blogs.json";
import blogCategoriesData from "@/data/allpages/_shared/blogcategories.json";
import { FAQ, SEO, stripLeadingSlash } from "./types";

export interface Blog {
  id: string;
  title: string;
  /** Route as stored, with a leading slash, e.g. "/select-the-best-..." */
  route: string;
  categoryName: string;
  blogCategoryId: string;
  verifiedBy: string;
  imageUrl: string;
  pageState: "publish" | "draft" | string;
  createdAt: string;
  updatedAt: string;
  seo: SEO;
  faqs: FAQ[];
  markdown: string;
}

export interface BlogCategory {
  id: string;
  title: string;
  blogs: string[];
}

const ALL_BLOGS: Blog[] = blogsData as Blog[];
const ALL_CATEGORIES: BlogCategory[] = blogCategoriesData as BlogCategory[];

export function getAllBlogs(): Blog[] {
  return ALL_BLOGS.filter((b) => b.pageState === "publish");
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogs().map((b) => stripLeadingSlash(b.route));
}

export function getBlogBySlug(slug: string): Blog | undefined {
  const target = stripLeadingSlash(slug);
  return getAllBlogs().find((b) => stripLeadingSlash(b.route) === target);
}

export function getBlogById(id: string): Blog | undefined {
  return ALL_BLOGS.find((b) => b.id === id);
}

export function getBlogCategories(): BlogCategory[] {
  return ALL_CATEGORIES;
}

export function getBlogCategoryById(id: string): BlogCategory | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

export function getBlogsByCategoryId(categoryId: string): Blog[] {
  return getAllBlogs().filter((b) => b.blogCategoryId === categoryId);
}

export function getBlogsByCategoryTitle(title: string): Blog[] {
  const cat = ALL_CATEGORIES.find(
    (c) => c.title.toLowerCase() === title.toLowerCase(),
  );
  if (!cat) return [];
  return getBlogsByCategoryId(cat.id);
}

export function getRecentBlogs(limit = 6): Blog[] {
  return [...getAllBlogs()]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}
