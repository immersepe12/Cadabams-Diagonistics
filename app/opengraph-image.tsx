import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

// Default site OG image (used by the home page and any route without its own).
export const alt =
  "Cadabams Diagnostics — Accurate lab tests & scans in Bangalore";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Cadabam's Diagnostics",
    title: "Accurate lab tests & scans in Bangalore",
  });
}
