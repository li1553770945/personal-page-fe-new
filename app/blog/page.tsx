import type { Metadata } from "next"

import { BlogIndexView } from "@/components/blog/blog-index-view"
import { BlogRouteView } from "@/components/blog/blog-route-view"
import { getPublicBlogPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "博客",
  description: "PeaceSheep 关于后端、云原生、分布式系统与 AI 基础设施的文章。",
  alternates: { canonical: "/blog" },
}

export default async function BlogPage() {
  if (process.env.OPENNEXT_BUILD === "1") {
    const data = await getPublicBlogPosts()
    return <BlogIndexView posts={data?.items ?? []} />
  }
  return <BlogRouteView />
}
