/**
 * Push the site's content into Meilisearch.
 *
 * Run with:
 *   pnpm search:index
 *   # which is: node --env-file=.env.local --import tsx scripts/index-meili.ts
 *
 * Uses the ADMIN key (server-side only). The admin key must never appear in any
 * client component or NEXT_PUBLIC_* variable.
 *
 * Data source: the same static-JSON loaders the site renders from
 * (lib/data/*.ts), so search results always match real pages. URLs are built
 * with the existing lib/urls.ts helpers — important because a scan's URL family
 * (ct-scan / mri-scan / …) is derived from its category.
 *
 * Documents are kept LEAN on purpose — only high-signal fields are indexed (no
 * markdown bodies, FAQs, or interpretation tables). The full content stays on
 * the page; search only routes users to it.
 *
 * If the host/admin key are missing, the script runs as a DRY RUN: it builds and
 * reports the documents without contacting Meilisearch.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Meilisearch, type Settings } from "meilisearch";

import { getAllLabTests, getPriceNumber } from "@/lib/data/labtests";
import {
  getAllNonLabTests,
  getNonLabPriceNumber,
  getNonLabTestCategoryById,
} from "@/lib/data/nonlabtests";
import { getAllBlogs } from "@/lib/data/blogs";
import { stripLeadingSlash } from "@/lib/data/types";
import { labTestUrl, nonLabTestUrl, blogUrl } from "@/lib/urls";
import { titleCaseTestName } from "@/lib/format";
import type { TestHit, BlogHit } from "@/lib/meilisearch";

// Keep these UIDs in sync with SEARCH_INDEXES in lib/meilisearch.ts.
const INDEX = {
  labTests: "cadabams_diagnostics_labtest",
  scans: "cadabams_diagnostics_radiology",
  blogs: "cadabams_diagnostics_blogs",
} as const;

// --- Per-index settings (driven by the fields that actually exist) ----------

const TEST_SHARED_SYNONYMS: Record<string, string[]> = {
  sugar: ["glucose"],
  glucose: ["sugar"],
  cbc: ["complete blood count"],
  tsh: ["thyroid stimulating hormone"],
  lft: ["liver function test"],
  kft: ["kidney function test", "renal function test"],
};

const LAB_TESTS_SETTINGS: Settings = {
  searchableAttributes: ["title", "about", "category", "identifies", "measures"],
  filterableAttributes: ["type", "category", "price"],
  sortableAttributes: ["price"],
  synonyms: TEST_SHARED_SYNONYMS,
  stopWords: ["test", "bangalore"],
};

const RADIOLOGY_SCANS_SETTINGS: Settings = {
  searchableAttributes: [
    "title",
    "about",
    "aliases",
    "category",
    "identifies",
    "measures",
  ],
  filterableAttributes: ["type", "category", "price"],
  sortableAttributes: ["price"],
  synonyms: {
    sonography: ["ultrasound", "usg"],
    ultrasound: ["sonography", "usg"],
    usg: ["ultrasound", "sonography"],
    mri: ["magnetic resonance imaging"],
    ct: ["computed tomography", "ct scan"],
    pregnancy: ["fetal", "obstetric"],
    piles: ["perianal"],
  },
  stopWords: ["scan", "bangalore"],
};

const BLOGS_SETTINGS: Settings = {
  searchableAttributes: ["title", "tags", "excerpt"],
  filterableAttributes: ["tags"],
  sortableAttributes: ["publishedAt"],
  stopWords: ["the", "a", "an", "and", "of", "to", "in"],
};

// --- Helpers ----------------------------------------------------------------

/** Meilisearch document ids must match /^[\w-]+$/. */
function safeId(slug: string): string {
  return stripLeadingSlash(slug)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Split a free-text "also known as" string into clean alias tokens. */
function splitAliases(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,/|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Light markdown strip for a fallback excerpt. */
function excerptFromMarkdown(markdown: string | undefined, max = 160): string {
  if (!markdown) return "";
  const text = markdown
    .replace(/[#>*_`~\-]+/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function uniqueNonEmpty(values: (string | undefined)[]): string[] {
  return [...new Set(values.map((v) => (v ?? "").trim()).filter(Boolean))];
}

/**
 * Short "about" summary for a test/scan: prefer the SEO description, falling back
 * to what the test identifies / measures.
 */
function aboutText(
  seoDescription: string | undefined,
  identifies: string | undefined,
  measures: string | undefined,
): string {
  const seo = (seoDescription ?? "").trim();
  if (seo) return seo;
  return [identifies, measures]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(". ");
}

// --- Document builders ------------------------------------------------------

function buildLabTestDocs(): TestHit[] {
  return getAllLabTests()
    .map((test): TestHit | null => {
      const id = safeId(test.route);
      if (!id) return null;
      const info = test.basic_info;
      return {
        id,
        type: "lab-test",
        url: labTestUrl(test),
        title: titleCaseTestName(info.name || test.testName),
        about: aboutText(test.seo?.description, info.Identifies, info.measures),
        category: info.testCategory ?? "",
        identifies: info.Identifies ?? "",
        measures: info.measures ?? "",
        price: getPriceNumber(test),
        reportTime: info.reportsWithin ?? "",
        image: info.imageSrc ?? "",
      };
    })
    .filter((d): d is TestHit => d !== null);
}

function buildScanDocs(): TestHit[] {
  return getAllNonLabTests()
    .map((test): TestHit | null => {
      const id = safeId(test.route);
      if (!id) return null;
      const info = test.basic_info;
      const category = getNonLabTestCategoryById(info.categoryId);
      return {
        id,
        type: "scan",
        url: nonLabTestUrl(test),
        title: titleCaseTestName(info.name || test.testName),
        about: aboutText(test.seo?.description, info.Identifies, info.measures),
        aliases: splitAliases(info.alsoKnownAs),
        category: info.testCategory ?? category?.name ?? "",
        identifies: info.Identifies ?? "",
        measures: info.measures ?? "",
        price: getNonLabPriceNumber(test),
        reportTime: info.reportsWithin ?? "",
        image: category?.image ?? info.imageSrc ?? "",
      };
    })
    .filter((d): d is TestHit => d !== null);
}

function buildBlogDocs(): BlogHit[] {
  return getAllBlogs()
    .map((blog): BlogHit | null => {
      const id = safeId(blog.route);
      if (!id) return null;
      return {
        id,
        type: "blog",
        url: blogUrl(blog),
        title: blog.title,
        excerpt: blog.seo?.description || excerptFromMarkdown(blog.markdown),
        tags: uniqueNonEmpty([blog.categoryName, ...(blog.seo?.keywords ?? "").split(",")]),
        publishedAt: blog.createdAt,
        image: blog.imageUrl ?? "",
      };
    })
    .filter((d): d is BlogHit => d !== null);
}

// --- Push to Meilisearch ----------------------------------------------------

async function pushIndex(
  client: Meilisearch,
  uid: string,
  settings: Settings,
  documents: Array<TestHit | BlogHit>,
): Promise<void> {
  // Create the index (idempotent — a failed "already exists" task is harmless).
  await client.createIndex(uid, { primaryKey: "id" }).waitTask({ timeout: 0 });

  const index = client.index(uid);
  await index.updateSettings(settings).waitTask({ timeout: 0 });

  const task = await index
    .addDocuments(documents, { primaryKey: "id" })
    .waitTask({ timeout: 0 });

  if (task.status !== "succeeded") {
    throw new Error(
      `Indexing "${uid}" failed (status: ${task.status}): ${JSON.stringify(task.error)}`,
    );
  }
  console.log(`  ✓ ${uid}: ${documents.length} documents indexed`);
}

async function main(): Promise<void> {
  const host = process.env.NEXT_PUBLIC_MEILI_HOST;
  const adminKey = process.env.MEILI_ADMIN_KEY;

  console.log("Building documents from the site's data loaders…");
  const groups = [
    { uid: INDEX.labTests, settings: LAB_TESTS_SETTINGS, docs: buildLabTestDocs() },
    { uid: INDEX.scans, settings: RADIOLOGY_SCANS_SETTINGS, docs: buildScanDocs() },
    { uid: INDEX.blogs, settings: BLOGS_SETTINGS, docs: buildBlogDocs() },
  ];

  for (const g of groups) {
    console.log(`  • ${g.uid}: ${g.docs.length} documents`);
    if (g.docs[0]) console.log(`    e.g. ${JSON.stringify(g.docs[0])}`);
  }

  // --export: write one JSON file of documents (+ one of settings) per index,
  // ready to upload to Meilisearch Cloud. No host/keys needed.
  if (process.argv.includes("--export")) {
    const outDir = join(process.cwd(), "meili-export");
    mkdirSync(outDir, { recursive: true });
    console.log(`\nWriting export files to ${outDir} …`);
    for (const g of groups) {
      writeFileSync(
        join(outDir, `${g.uid}.documents.json`),
        JSON.stringify(g.docs, null, 2),
      );
      writeFileSync(
        join(outDir, `${g.uid}.settings.json`),
        JSON.stringify(g.settings, null, 2),
      );
      console.log(
        `  ✓ ${g.uid}: ${g.docs.length} docs → ${g.uid}.documents.json (+ ${g.uid}.settings.json)`,
      );
    }
    console.log(
      "\n✅ Export complete. In Meilisearch Cloud, create each index (primary key \"id\")," +
        "\n   upload its *.documents.json, then apply its *.settings.json.",
    );
    return;
  }

  if (!host || !adminKey) {
    console.warn(
      "\n⚠  DRY RUN — NEXT_PUBLIC_MEILI_HOST and/or MEILI_ADMIN_KEY are not set.\n" +
        "   Documents were built but NOT pushed. Fill .env.local and re-run.",
    );
    return;
  }

  const client = new Meilisearch({ host, apiKey: adminKey });
  console.log(`\nPushing to ${host} …`);
  for (const g of groups) {
    await pushIndex(client, g.uid, g.settings, g.docs);
  }
  console.log("\n✅ Done. All three indexes are up to date.");
}

main().catch((err) => {
  console.error("\n❌ Indexing failed:");
  console.error(err);
  process.exit(1);
});
