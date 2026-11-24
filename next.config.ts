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
    return [
      { source: "/cv", destination: "/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf", permanent: false },
      // Consolidated journeys (Phase 2): old URLs keep working.
      { source: "/services", destination: "/book", permanent: true },
      { source: "/ar/services", destination: "/ar/book", permanent: true },
      { source: "/collaborate", has: [{ type: "query", key: "type", value: "career" }], destination: "/contact?intent=hiring", permanent: true },
      { source: "/ar/collaborate", has: [{ type: "query", key: "type", value: "career" }], destination: "/ar/contact?intent=hiring", permanent: true },
      { source: "/collaborate", destination: "/contact?intent=collaboration", permanent: true },
      { source: "/ar/collaborate", destination: "/ar/contact?intent=collaboration", permanent: true },
    ];
  },
};

export default nextConfig;
