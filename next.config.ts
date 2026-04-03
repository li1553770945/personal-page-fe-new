import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  compress: false,
  async rewrites() {
    // Slidev 等 SPA：/slides/decks/:id/1 等路径没有对应物理文件时回退到该套的 index.html。
    // 使用 fallback，在 public 下已有文件（如 assets/*）时仍优先走静态文件，不会误改写到 index.html。
    const slideDeckSpaFallback = [
      {
        source: "/slides/decks/:deck",
        destination: "/slides/decks/:deck/index.html",
      },
      {
        source: "/slides/decks/:deck/",
        destination: "/slides/decks/:deck/index.html",
      },
      {
        source: "/slides/decks/:deck/:path*",
        destination: "/slides/decks/:deck/index.html",
      },
    ];

    const env = process.env.NODE_ENV;
    if (!env || env !== "development") {
      return { fallback: slideDeckSpaFallback };
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
      fallback: slideDeckSpaFallback,
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
