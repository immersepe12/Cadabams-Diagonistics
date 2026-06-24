import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { scanListingOgTitle } from "@/lib/scan-pages";

const FAMILY = "xray-scan";

export const alt = "XRay in Bangalore at Cadabams Diagnostics";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Cadabams Diagnostics",
    title: scanListingOgTitle(FAMILY),
  });
}
