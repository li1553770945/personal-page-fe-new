import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  compress: false,
  async rewrites() {
    const env = process.env.NODE_ENV;
    if (!env || env !== 'development') {
      return [];
    }
    
    // 从环境变量直接读取代理目标，如果没有设置则默认为本地后端
    const apiTarget = process.env.NEXT_PUBLIC_API_PROXY_URL;
    if (!apiTarget) {
      throw new Error('错误: NEXT_PUBLIC_API_PROXY_URL 环境变量未设置.请在.env.development文件中设置(e.g., NEXT_PUBLIC_API_PROXY_URL=http://localhost:9100).');
    }
    console.log(`Proxying API requests to ${apiTarget}`);

    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`, // 转发到后端
      },
      // 注意：Next.js 的 rewrites 原生不支持 WebSocket (ws) 代理
    ];
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
