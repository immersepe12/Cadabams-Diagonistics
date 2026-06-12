import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import type { Blog } from "@/lib/data/blogs";
import { stripLeadingSlash } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
  className?: string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return DATE_FORMATTER.format(d);
}

export function BlogCard({ blog, className }: BlogCardProps) {
  const slug = stripLeadingSlash(blog.route);
  const href = `/blogs/${slug}`;
  const hasImage = !!blog.imageUrl && blog.imageUrl.length > 0;
  const excerpt = blog.seo?.description || "";
  const date = formatDate(blog.createdAt);

  return (
    <article
      className={cn(
        "group bg-cream-card rounded-xl sm:rounded-2xl border border-cream-line shadow-sh-1 hover:shadow-sh-3 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden h-full",
        className,
      )}
    >
      {hasImage && (
        <Link
          href={href}
          aria-label={blog.title}
          className="relative aspect-[16/10] block overflow-hidden bg-cream-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.imageUrl}
            alt={blog.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
          {blog.categoryName && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 inline-flex items-center rounded-pill bg-cream-card/95 backdrop-blur-sm text-orange-700 border border-orange-100 text-caption font-bold uppercase tracking-overline px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-sh-1">
              {blog.categoryName}
            </span>
          )}
        </Link>
      )}

      <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-1">
        {!hasImage && blog.categoryName && (
          <span className="self-start inline-flex items-center rounded-pill bg-orange-50 text-orange-700 border border-orange-100 text-caption font-bold uppercase tracking-overline px-2 py-0.5 sm:px-2.5 sm:py-1 mb-2 sm:mb-3">
            {blog.categoryName}
          </span>
        )}

        <h3 className="text-body sm:text-h3 text-ink-900 font-bold leading-snug line-clamp-2">
          <Link
            href={href}
            className="hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {blog.title}
          </Link>
        </h3>

        {excerpt && (
          <p className="mt-1.5 sm:mt-2 text-caption sm:text-body-sm text-ink-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {excerpt}
          </p>
        )}

        <div className="mt-auto pt-3 sm:pt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption sm:text-meta text-ink-500">
          {date && (
            <time
              dateTime={blog.createdAt}
              className="inline-flex items-center gap-1"
            >
              <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-ink-400" />
              {date}
            </time>
          )}
          <Link
            href={href}
            aria-label={`Read ${blog.title}`}
            className="ml-auto inline-flex items-center gap-1 text-orange-600 font-bold hover:translate-x-0.5 transition-transform"
          >
            Read
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
