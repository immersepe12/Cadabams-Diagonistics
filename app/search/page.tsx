import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/SearchExperience";

export const metadata: Metadata = {
  title: "Search | Cadabam's Diagnostics",
  // Search results pages should not be indexed.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="bg-cream-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-gutter py-8 lg:py-12">
        <header className="mb-6">
          <h1 className="text-h1 font-display font-extrabold text-ink-900">
            Search
          </h1>
          <p className="mt-1 text-body-sm text-ink-500">
            Find lab tests, radiology scans and health articles.
          </p>
        </header>
        <Suspense
          fallback={
            <p className="text-body-sm text-ink-500">Loading search…</p>
          }
        >
          <SearchExperience />
        </Suspense>
      </div>
    </main>
  );
}
