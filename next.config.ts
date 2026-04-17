import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:locale/category/ski",
        destination: "/:locale/category/ski-snowboard",
        permanent: true,
      },
      {
        source: "/:locale/category/snowboard",
        destination: "/:locale/category/ski-snowboard",
        permanent: true,
      },
      {
        source: "/:locale/category/cycling",
        destination: "/:locale/category/cycling-running",
        permanent: true,
      },
      {
        source: "/:locale/category/running",
        destination: "/:locale/category/cycling-running",
        permanent: true,
      },
      {
        source: "/:locale/category/sleeping-systems",
        destination: "/:locale/category/camping-survival-gear",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
