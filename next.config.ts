import type { NextConfig } from "next";

const isOpenNextBuild = process.env.OPENNEXT_BUILD === "1";

const nextConfig: NextConfig = {
  /* config options here */
  ...(isOpenNextBuild ? {} : { output: "export" as const }),
  images: {
    unoptimized: true,
  },
  compress: false,
  async rewrites() {
    const env = process.env.NODE_ENV;
    if (!env || env !== "development") {
      return [];
    }

    // 从环境变量直接读取代理目标，如果没有设置则默认为本地后端
    const apiTarget = process.env.NEXT_PUBLIC_API_PROXY_URL;
    if (!apiTarget) {
      throw new Error(
        "错误: NEXT_PUBLIC_API_PROXY_URL 环境变量未设置.请在.env.development文件中设置(e.g., NEXT_PUBLIC_API_PROXY_URL=http://localhost:9100)."
      );
    }
    console.log(`Proxying API requests to ${apiTarget}`);

    return {
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${apiTarget}/api/:path*`,
        },
      ],
    };
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 强制不处理 fs 和 path 模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  experimental: {
    proxyTimeout: 60000,
  },
};

export default nextConfig;
