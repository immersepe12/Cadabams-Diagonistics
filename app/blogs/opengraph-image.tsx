import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Health & Diagnostics Blog at Cadabams Diagnostics";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Cadabams Diagnostics",
    title: "Health & Diagnostics Blog",
  });
}
