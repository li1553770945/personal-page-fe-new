import { cache } from "react"

import type { ApiResponse, BlogPostData, BlogPostListData } from "@/types/api"

const serverApiBase = () => {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/$/, "")
  }
  const proxy = process.env.NEXT_PUBLIC_API_PROXY_URL
  if (proxy && /^https?:\/\//i.test(proxy)) {
    return `${proxy.replace(/\/$/, "")}/api`
  }
  return "https://api.peacesheep.xyz/api"
}

async function fetchBlog<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${serverApiBase()}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
    if (!response.ok) return null
    const body = (await response.json()) as ApiResponse<T>
    return body.code === 0 ? body.data : null
  } catch {
    return null
  }
}

export const getPublicBlogPosts = cache(async () =>
  fetchBlog<BlogPostListData>("/blog/posts?pageSize=100")
)

export const getPublicBlogPost = cache(async (slug: string) =>
  fetchBlog<BlogPostData>(`/blog/posts/${encodeURIComponent(slug)}`)
)
