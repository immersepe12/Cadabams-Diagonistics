import { notFound, permanentRedirect } from "next/navigation";
import { getNonLabTestBySlug } from "@/lib/data/nonlabtests";
import {
  getLabTestBySlug,
  getLabTestCategoryBySlug,
} from "@/lib/data/labtests";
import {
  labTestUrl,
  nonLabTestUrl,
  labCategoryUrl,
} from "@/lib/urls";
import { stripLeadingSlash } from "@/lib/data/types";

/**
 * Legacy / flat redirects for `/bangalore/<slug>`.
 *
 * Old scan and lab URLs omitted the category segment (e.g. `/bangalore/brain-mri`
 * instead of `/bangalore/mri-scan/brain-mri`), so indexed links and bookmarks
 * 404 on the new nested structure. The static family segments (`mri-scan`,
 * `lab-test`, `center`, …) take precedence over this dynamic segment, so only
 * unknown slugs reach here — we 308-redirect known tests/categories to their
 * canonical URL and 404 the rest.
 */
export default async function BangaloreFlatSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const scan = getNonLabTestBySlug(slug);
  if (scan) permanentRedirect(nonLabTestUrl(scan));

  const labTest = getLabTestBySlug(slug);
  if (labTest) permanentRedirect(labTestUrl(labTest));

  const labCategory = getLabTestCategoryBySlug(slug);
  if (labCategory) {
    permanentRedirect(
      labCategoryUrl(labCategory.id) ||
        `/bangalore/lab-test/${stripLeadingSlash(labCategory.path)}`,
    );
  }

  notFound();
}
