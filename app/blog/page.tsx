import type { Metadata } from "next"

import { BlogRouteView } from "@/components/blog/blog-route-view"

export const metadata: Metadata = {
  title: "博客",
  description: "PeaceSheep 关于后端、云原生、分布式系统与 AI 基础设施的文章。",
  alternates: { canonical: "/blog" },
}

export default function BlogPage() {
  return <BlogRouteView />
}
