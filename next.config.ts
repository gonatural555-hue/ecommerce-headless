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
    ];
  },
};

export default nextConfig;
