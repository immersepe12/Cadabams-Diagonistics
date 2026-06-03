import { getNonLabTestBySlug } from "@/lib/data/nonlabtests";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

export const alt = "Preventive health check at Cadabams Diagnostics";
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
    eyebrow: "Preventive Health",
    title: test?.testName ?? "Preventive Health Check in Bangalore",
  });
}
