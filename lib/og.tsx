import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Shared size/type for every generated OG (and Twitter) image. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let logoCache: string | null = null;
async function getLogoSrc(): Promise<string> {
  if (logoCache) return logoCache;
  const buf = await readFile(join(process.cwd(), "public", "og-logo.png"));
  logoCache = `data:image/png;base64,${buf.toString("base64")}`;
  return logoCache;
}

/** Scale the title down as it gets longer so it always fits the card. */
function titleFontSize(title: string): number {
  const len = title.length;
  if (len > 90) return 36;
  if (len > 64) return 44;
  if (len > 40) return 52;
  if (len > 24) return 60;
  return 66;
}

/**
 * Render a branded Open Graph image for a page. Used by the root
 * `opengraph-image` and by every per-route `opengraph-image` so each page
 * gets a distinct, on-brand share image with its own title.
 */
export async function renderOgImage({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}): Promise<ImageResponse> {
  const logoSrc = await getLogoSrc();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          background:
            "linear-gradient(135deg, #F97316 0%, #F77268 58%, #E14B6A 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFF9F4",
            borderRadius: 28,
            padding: "48px 64px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={196}
            height={163}
            alt=""
            style={{ objectFit: "contain" }}
          />

          {eyebrow ? (
            <div
              style={{
                marginTop: 22,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#EA580C",
              }}
            >
              {eyebrow}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 14,
              fontSize: titleFontSize(title),
              fontWeight: 700,
              color: "#1A1A1A",
              textAlign: "center",
              lineHeight: 1.15,
              maxWidth: 1000,
              display: "flex",
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 24,
              fontWeight: 600,
              color: "#C2410C",
            }}
          >
            <span>Reports in 6 hours</span>
            <span style={{ color: "#F59E0B" }}>•</span>
            <span>NABL Certified</span>
            <span style={{ color: "#F59E0B" }}>•</span>
            <span>Bangalore</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
