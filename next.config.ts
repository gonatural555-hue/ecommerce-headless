import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingIncludes: {
<<<<<<< HEAD
    "/*": ["./scripts/products/**/*.json"],
=======
    "/*": ["./scripts/good-ideas-products/**/*.json"],
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
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
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/good-ideas/:path*",
        destination: "/:locale/:path*",
        permanent: true,
      },
      {
        source: "/:locale/go-natural",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/go-natural/:path*",
        destination: "/:locale/:path*",
        permanent: true,
      },
      {
        source: "/:locale/category/:path*",
        destination: "/:locale/products",
        permanent: true,
      },
      {
        source: "/:locale/categories",
        destination: "/:locale/products",
        permanent: true,
      },
      {
        source: "/:locale/brands/:path*",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/landing",
        destination: "/:locale",
        permanent: true,
      },
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
