import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingIncludes: {
    "/*": ["./scripts/products/**/*.json"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:locale/good-ideas",
        destination: "/:locale/go-natural",
        permanent: true,
      },
      {
        source: "/:locale/good-ideas/:path*",
        destination: "/:locale/go-natural",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
