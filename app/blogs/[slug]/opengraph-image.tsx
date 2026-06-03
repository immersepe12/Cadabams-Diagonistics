import { getBlogBySlug } from "@/lib/data/blogs";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

export const alt = "Cadabams Diagnostics blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  return renderOgImage({
    eyebrow: "Blog",
    title: blog?.title ?? "Cadabams Diagnostics Blog",
  });
}
