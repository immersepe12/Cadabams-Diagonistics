import { getNonLabTestBySlug } from "@/lib/data/nonlabtests";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

export const alt = "Pregnancy scan at Cadabams Diagnostics";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getNonLabTestBySlug(slug);
  return renderOgImage({
    eyebrow: "Pregnancy Scan",
    title: test?.testName ?? "Pregnancy Scan in Bangalore",
  });
}
