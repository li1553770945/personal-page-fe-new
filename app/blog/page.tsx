import type { Metadata } from "next"

import { BlogIndexView } from "@/components/blog/blog-index-view"
import { getPublicBlogPosts } from "@/lib/blog"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "博客",
  description: "PeaceSheep 关于后端、云原生、分布式系统与 AI 基础设施的文章。",
  alternates: { canonical: "/blog" },
}

export default async function BlogPage() {
  const data = await getPublicBlogPosts()
  return <BlogIndexView posts={data?.items ?? []} />
}
