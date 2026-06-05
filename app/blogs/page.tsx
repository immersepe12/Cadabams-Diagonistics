import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  BookOpen,
  ShieldCheck,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import {
  getAllBlogs,
  getBlogCategories,
  getBlogsByCategoryId,
} from "@/lib/data/blogs";
import { BlogsListing } from "@/components/blogs/BlogsListing";
import { TrustBadges } from "@/components/shared/TrustBadges";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Health & Diagnostics Blog | Cadabam's Diagnostics",
  description:
    "Doctor-reviewed articles on lab tests, scans, preventive health, and wellness from Cadabam's Diagnostics.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/blogs" },
  openGraph: {
    title: "Cadabam's Diagnostics Blog",
    description:
      "Doctor-reviewed articles on tests, scans, and preventive health.",
    url: "/blogs",
    type: "website",
  },
};

const TRUST_POINTS = [
  { Icon: ShieldCheck, label: "Doctor reviewed" },
  { Icon: BookOpen, label: "Evidence-based" },
  { Icon: HeartPulse, label: "Patient first" },
  { Icon: Sparkles, label: "Updated weekly" },
] as const;

export default function BlogsListingPage() {
  const allBlogs = getAllBlogs();

  const CATEGORY_ORDER = ["Health", "Life Style", "Nutration", "Fitness"];
  const categories = getBlogCategories()
    .filter((c) => c.title && c.title.trim().length > 0)
    .map((c) => ({ ...c, count: getBlogsByCategoryId(c.id).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.title);
      const ib = CATEGORY_ORDER.indexOf(b.title);
      const sa = ia === -1 ? CATEGORY_ORDER.length : ia;
      const sb = ib === -1 ? CATEGORY_ORDER.length : ib;
      return sa - sb;
    });

  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-pill bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-pill bg-coral-400/30 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-gutter pt-4 pb-8 sm:pt-5 sm:pb-10 lg:pt-6 lg:pb-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-meta text-white/80 mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
            <span className="text-white font-semibold">Blog</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-overline uppercase text-white/80 font-bold mb-3 tracking-overline">
              Cadabam&apos;s Diagnostics blog
            </p>
            <h1 className="text-h1 sm:text-display-2 lg:text-[52px] lg:leading-[1.05] font-display font-extrabold mb-4 tracking-tight">
              Health insights you can trust
            </h1>
            <p className="text-body-sm sm:text-body lg:text-h3 text-white/90 max-w-2xl leading-relaxed">
              {allBlogs.length}+ doctor-reviewed articles on lab tests, scans,
              preventive health and wellness — to help you make confident
              health decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-6 lg:-mt-8 mx-auto max-w-7xl px-gutter">
        <TrustBadges
          items={TRUST_POINTS.map(({ Icon, label }) => ({
            icon: <Icon className="w-5 h-5" />,
            label,
          }))}
        />
      </section>

      <BlogsListing allBlogs={allBlogs} categories={categories} />
    </main>
  );
}
