import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllBlogSlugs,
  getBlogBySlug,
  getBlogsByCategoryId,
  getRecentBlogs,
} from "@/lib/data/blogs";
import { getAllCenters, getCenterSlug } from "@/lib/data/centers";
import { blogUrl } from "@/lib/urls";
import { pageTitle } from "@/lib/seo-title";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { BlogCard } from "@/components/shared/BlogCard";
import { BlogSidebar } from "@/components/shared/BlogSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FaqList } from "@/components/shared/FaqList";
import { Calendar, Home } from "lucide-react";

export const revalidate = 86400;

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return {};
  const fallbackDesc = blog.markdown
    ? blog.markdown.replace(/[#*_`>[\]()]/g, "").slice(0, 160).trim()
    : `${blog.title} — Cadabam's Diagnostics`;
  const canonical =
    blog.seo?.canonicalUrl ||
    `https://cadabamsdiagnostics.com${blogUrl(blog)}`;
  return {
    title: pageTitle(blog.seo?.title || blog.title),
    description: blog.seo?.description || fallbackDesc,
    alternates: { canonical },
    openGraph: {
      title: blog.seo?.ogTitle || blog.seo?.title || blog.title,
      description:
        blog.seo?.ogDescription || blog.seo?.description || fallbackDesc,
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : undefined,
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: blog.verifiedBy ? [blog.verifiedBy] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) notFound();

  const related = getBlogsByCategoryId(blog.blogCategoryId)
    .filter((b) => b.id !== blog.id)
    .slice(0, 3);
  const fallback =
    related.length > 0
      ? related
      : getRecentBlogs(4)
          .filter((b) => b.id !== blog.id)
          .slice(0, 3);

  const hasImage = !!blog.imageUrl && blog.imageUrl.length > 0;
  const published = (() => {
    const d = new Date(blog.createdAt);
    return Number.isNaN(d.getTime()) ? "" : DATE_FMT.format(d);
  })();

  const sidebarCenters = getAllCenters()
    .filter((c) => c.basic_info?.center_name?.trim().length > 0)
    .map((c) => ({
      name: c.basic_info.center_name.trim(),
      slug: getCenterSlug(c),
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.seo?.description,
    image: hasImage ? blog.imageUrl : undefined,
    author: {
      "@type": "Person",
      name: blog.verifiedBy || "Cadabam's Diagnostics",
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    publisher: {
      "@type": "Organization",
      name: "Cadabam's Diagnostics",
      url: "https://cadabamsdiagnostics.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cadabamsdiagnostics.com${blogUrl(blog)}`,
    },
  };

  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="relative overflow-hidden bg-gradient-orange-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-pill bg-orange-300/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-10 w-96 h-96 rounded-pill bg-coral-300/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-gutter pt-6 pb-8 lg:pt-8 lg:pb-12">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="inline-flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blogs">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-md">
                  {blog.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 max-w-4xl">
            <Link
              href="/blogs"
              className="inline-flex items-center rounded-pill bg-cream-card border border-orange-100 text-orange-700 font-bold text-overline uppercase px-3 py-1 tracking-overline hover:border-orange-200 transition-colors"
            >
              {blog.categoryName}
            </Link>
            <h1 className="mt-4 text-h2 sm:text-h1 lg:text-display-1 font-display font-extrabold text-ink-900 leading-tight tracking-tight">
              {blog.title}
            </h1>
            {published && (
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-ink-600">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <time dateTime={blog.createdAt}>{published}</time>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-gutter py-8 lg:py-10 grid gap-6 lg:gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-6 min-w-0">
          {hasImage && (
            <div className="rounded-2xl overflow-hidden shadow-sh-2 border border-cream-line bg-cream-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto block"
              />
            </div>
          )}

          <div className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-10">
            <MarkdownContent content={blog.markdown} />
          </div>

          {blog.faqs && blog.faqs.length > 0 && (
            <section className="bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-4 sm:p-6 lg:p-8">
              <h2 className="text-h2 font-display font-bold text-ink-900 mb-5">
                FAQs
              </h2>
              <FaqList items={blog.faqs} idPrefix="blog-faq" />
            </section>
          )}
        </article>

        <aside className="lg:col-span-1 min-w-0">
          <div className="lg:sticky lg:top-24">
            <BlogSidebar centers={sidebarCenters} />
          </div>
        </aside>
      </div>

      {fallback.length > 0 && (
        <section className="bg-cream-soft py-8 lg:py-10">
          <div className="mx-auto max-w-7xl px-gutter">
            <h2 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 mb-8 tracking-tight">
              Related articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {fallback.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
