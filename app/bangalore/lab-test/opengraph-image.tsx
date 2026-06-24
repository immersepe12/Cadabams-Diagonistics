import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Lab Tests in Bangalore at Cadabams Diagnostics";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Cadabams Diagnostics",
    title: "Lab Tests in Bangalore",
  });
}
