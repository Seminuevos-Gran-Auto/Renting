import type { NextConfig } from "next";

const isProductionBuild = process.env.NODE_ENV === "production";
const repoBasePath = "/Renting";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProductionBuild ? repoBasePath : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProductionBuild ? repoBasePath : "",
  },
};

export default nextConfig;
