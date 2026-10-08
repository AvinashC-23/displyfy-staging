import type { NextConfig } from "next";

const productionScripts = "script-src 'self' 'unsafe-inline'";
const developmentScripts = `${productionScripts} 'unsafe-eval'`;

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  poweredByHeader: false,
  images: { qualities: [50, 75] },
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; img-src 'self' data:; ${process.env.NODE_ENV === "production" ? productionScripts : developmentScripts}; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()"
          },
          ...(process.env.VERCEL === "1" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : [])
        ]
      }
    ];
  }
};

export default nextConfig;
