import { getLabTestBySlug } from "@/lib/data/labtests";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

export const alt = "Lab test at Cadabams Diagnostics";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getLabTestBySlug(slug);
  return renderOgImage({
    eyebrow: "Lab Test",
    title: test?.testName ?? "Lab Test in Bangalore",
  });
}
