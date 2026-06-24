import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { SiteFooterArea } from "@/components/layout/SiteFooterArea";
import { FloatingContactCTA } from "@/components/layout/FloatingContactCTA";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  // Resolve OG/Twitter image URLs against the host actually serving the page
  // (staging vercel.app vs. production), not a hardcoded domain — otherwise
  // social unfurls fetch the image from the wrong host and show nothing.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Cadabams Diagnostics — Accurate lab tests & scans in Bangalore",
    template: "%s | Cadabams Diagnostics",
  },
  description:
    "Trusted lab tests, radiology, and health checkups across Bangalore. Reports in 6 hours. Certified labs. Home sample collection.",
  openGraph: {
    type: "website",
    siteName: "Cadabams Diagnostics",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-cream-bg text-ink-900 flex flex-col overflow-x-hidden">
        <Header />
        {children}
        <SiteFooterArea />
        <FloatingContactCTA />
      </body>
    </html>
  );
}
