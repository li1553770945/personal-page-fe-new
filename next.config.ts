import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },

  async rewrites() {
    const env = process.env.NODE_ENV;
    if (!env || env !== 'development') {
      return [];
    }
    const proxyMode = process.env.PROXY_MODE;
    if (!proxyMode) {
      throw new Error('PROXY_MODE is not set');
    }
    if (proxyMode !== 'prod' && proxyMode !== 'local') {
      throw new Error('PROXY_MODE must be prod or local');
    }

    const apiTarget = proxyMode === 'prod'
      ? 'https://api.peacesheep.xyz'
      : 'http://localhost:9100';
    console.log(`PROXY_MODE is set to ${proxyMode}, proxying API requests to ${apiTarget}`);

    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`, // 转发到后端
      },
      // 注意：Next.js 的 rewrites 原生不支持 WebSocket (ws) 代理
    ];
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true, // 301 永久重定向
      },
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
