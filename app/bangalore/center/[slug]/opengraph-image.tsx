import { getCenterBySlug } from "@/lib/data/centers";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

export const alt = "Cadabams Diagnostics centre";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const center = getCenterBySlug(slug);
  return renderOgImage({
    eyebrow: "Diagnostic Centre",
    title: center?.basic_info.center_name ?? "Cadabams Diagnostics Centre",
  });
}
