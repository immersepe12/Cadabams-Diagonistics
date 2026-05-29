import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/data/blogs";
import { getAllLabTests } from "@/lib/data/labtests";
import { getAllNonLabTests } from "@/lib/data/nonlabtests";
import { getAllCenters } from "@/lib/data/centers";
import {
  blogUrl,
  centerUrl,
  labTestUrl,
  nonLabTestUrl,
} from "@/lib/urls";

const BASE = "https://cadabamsdiagnostics.com";

const SCAN_FAMILIES = [
  "lab-test",
  "xray-scan",
  "mri-scan",
  "ct-scan",
  "ultrasound-scan",
  "msk-scan",
  "pregnancy-scan",
  "preventive-health-checks",
] as const;

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
}> = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/bangalore", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blogs", priority: 0.8, changeFrequency: "daily" },
  { path: "/about-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/management-team", priority: 0.5, changeFrequency: "monthly" },
  { path: "/clinical-team", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/terms-of-use", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
];

function parseDate(value: string | undefined | null, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const familyEntries: MetadataRoute.Sitemap = SCAN_FAMILIES.map((f) => ({
    url: `${BASE}/bangalore/${f}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blogEntries: MetadataRoute.Sitemap = getAllBlogs().map((b) => ({
    url: `${BASE}${blogUrl(b)}`,
    lastModified: parseDate(b.updatedAt, now),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const labTestEntries: MetadataRoute.Sitemap = getAllLabTests().map((t) => ({
    url: `${BASE}${labTestUrl(t)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const scanEntries: MetadataRoute.Sitemap = getAllNonLabTests().map((t) => ({
    url: `${BASE}${nonLabTestUrl(t)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const centerEntries: MetadataRoute.Sitemap = getAllCenters().map((c) => ({
    url: `${BASE}${centerUrl(c)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const dedup = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [
    ...staticEntries,
    ...familyEntries,
    ...centerEntries,
    ...labTestEntries,
    ...scanEntries,
    ...blogEntries,
  ]) {
    dedup.set(entry.url, entry);
  }

  return Array.from(dedup.values());
}
