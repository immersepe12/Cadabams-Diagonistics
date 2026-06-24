/**
 * Absolute origin for the current deployment.
 *
 * Used as the Next.js Metadata `metadataBase` so that OG/Twitter images (and
 * any other relative metadata URLs) resolve to the host that is actually
 * serving the page. Previously this was hardcoded to the production domain,
 * which meant the staging deployment on *.vercel.app emitted
 * `og:image` URLs pointing at cadabamsdiagnostics.com — where that image route
 * doesn't exist — so social unfurls (Slack, etc.) showed no image.
 *
 * Resolution order:
 *   1. SITE_URL / NEXT_PUBLIC_SITE_URL — explicit override. Set this to
 *      `https://cadabamsdiagnostics.com` once the app is live on that domain.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *      on Vercel (e.g. `cadabams-diagonistics.vercel.app`).
 *   3. VERCEL_URL — the per-deployment URL (preview builds).
 *   4. Production domain fallback (local builds / non-Vercel).
 */
export function getSiteUrl(): string {
  const explicit = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  const vercelDeployment = process.env.VERCEL_URL;
  if (vercelDeployment) return `https://${vercelDeployment}`;

  return "https://cadabamsdiagnostics.com";
}
