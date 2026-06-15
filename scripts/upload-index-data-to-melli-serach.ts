/**
 * Upload the generated Meilisearch export files to your instance.
 *
 * Reads `meili-export/<uid>.documents.json` + `<uid>.settings.json` (produced by
 * `pnpm search:export`) and pushes them with the ADMIN key. Use this when you
 * want to review/edit the export files before uploading; `pnpm search:index`
 * builds and pushes the same data directly from the site's data loaders.
 *
 * Run with:
 *   pnpm search:upload
 *   # node --env-file=.env.local --import tsx scripts/upload-index-data-to-melli-serach.ts
 *
 * The admin key is server-side only — never expose it in client code.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Meilisearch, type Settings } from "meilisearch";
import { SEARCH_INDEXES } from "@/lib/meilisearch";

const EXPORT_DIR = join(process.cwd(), "meili-export");

function readJson<T>(fileName: string): T {
  const path = join(EXPORT_DIR, fileName);
  if (!existsSync(path)) {
    throw new Error(
      `Missing ${path}.\nRun \`pnpm search:export\` first to generate the export files.`,
    );
  }
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

async function main(): Promise<void> {
  const host = process.env.NEXT_PUBLIC_MEILI_HOST;
  const adminKey = process.env.MEILI_ADMIN_KEY;
  if (!host || !adminKey) {
    throw new Error(
      "NEXT_PUBLIC_MEILI_HOST and MEILI_ADMIN_KEY must be set.\n" +
        "Fill them in .env.local and run via `pnpm search:upload`.",
    );
  }

  const client = new Meilisearch({ host, apiKey: adminKey });
  console.log(`Uploading export files from ${EXPORT_DIR}`);
  console.log(`  → ${host}\n`);

  for (const uid of SEARCH_INDEXES) {
    const documents = readJson<Record<string, unknown>[]>(
      `${uid}.documents.json`,
    );
    const settings = readJson<Settings>(`${uid}.settings.json`);

    // Create the index (idempotent — a failed "already exists" task is harmless).
    await client.createIndex(uid, { primaryKey: "id" }).waitTask({ timeout: 0 });

    const index = client.index(uid);
    await index.updateSettings(settings).waitTask({ timeout: 0 });

    const task = await index
      .addDocuments(documents, { primaryKey: "id" })
      .waitTask({ timeout: 0 });

    if (task.status !== "succeeded") {
      throw new Error(
        `Upload to "${uid}" failed (status: ${task.status}): ${JSON.stringify(task.error)}`,
      );
    }
    console.log(`  ✓ ${uid}: ${documents.length} documents uploaded`);
  }

  console.log("\n✅ Done. All three indexes are uploaded and configured.");
}

main().catch((err) => {
  console.error("\n❌ Upload failed:");
  console.error(err);
  process.exit(1);
});
