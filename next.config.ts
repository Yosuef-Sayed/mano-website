import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Stable, shareable CV link. Replace the PDF in /public/files; this URL never changes.
    return [{ source: "/cv", destination: "/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf", permanent: false }];
  },
};

export default nextConfig;
