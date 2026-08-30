import type { MetadataRoute } from "next"

import { getPublicBlogPosts } from "@/lib/blog"

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://peacesheep.xyz")

export const dynamic = "force-static"

const publicRoutes = [
  "/",
  "/projects",
  "/slides",
  "/friends",
  "/appreciate",
  "/feedback",
  "/blog",
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blog = await getPublicBlogPosts()
  const routes: MetadataRoute.Sitemap = publicRoutes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }))
  for (const post of blog?.items ?? []) {
    routes.push({
      url: new URL(`/blog/${post.slug}`, siteUrl).toString(),
      lastModified: new Date((post.updatedAt || post.publishedAt || post.createdAt) * 1000),
    })
  }
  return routes
}
