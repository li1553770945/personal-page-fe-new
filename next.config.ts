import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const proxyMode = process.env.PROXY_MODE;
    if (!proxyMode) {
      console.warn('PROXY_MODE is not set, not proxying API requests');
      return [];
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
};

export default nextConfig;
