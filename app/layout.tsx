import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { SiteFooterArea } from "@/components/layout/SiteFooterArea";
import { FloatingContactCTA } from "@/components/layout/FloatingContactCTA";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cadabamsdiagnostics.com"),
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
  robots: { index: true, follow: true },
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
