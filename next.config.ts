import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/lab-test", destination: "/bangalore/lab-test", permanent: true },
      { source: "/xray-scan", destination: "/bangalore/xray-scan", permanent: true },
      { source: "/mri-scan", destination: "/bangalore/mri-scan", permanent: true },
      { source: "/ultrasound-scan", destination: "/bangalore/ultrasound-scan", permanent: true },
      { source: "/pregnancy-scan", destination: "/bangalore/pregnancy-scan", permanent: true },
      { source: "/msk-scan", destination: "/bangalore/msk-scan", permanent: true },
      { source: "/ultrasound-scan-bangalore", destination: "/bangalore/ultrasound-scan", permanent: true },

      { source: "/bangalore/center/kanakapura", destination: "/bangalore/center/kanakapura-road", permanent: true },
      { source: "/bangalore/center/kalyannagar", destination: "/bangalore/center/kalyan-nagar", permanent: true },

      { source: "/bangalore/preventive-health/:slug", destination: "/bangalore/preventive-health-checks/:slug", permanent: true },

      { source: "/bangalore/mri-scan/lumbar-lumbosacral-spine-without-contrast-mri", destination: "/bangalore/mri-scan/lumbar-lumbosacral-spine-without-contrast-mri-scan", permanent: true },

      { source: "/blogs/difference-between-mri-and-x-ray", destination: "/blogs/difference-between-mri-and-xray", permanent: true },
    ];
  },
};

export default nextConfig;
