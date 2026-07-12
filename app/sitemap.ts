import type { MetadataRoute } from "next"

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://peacesheep.xyz")

export const dynamic = "force-static"

const publicRoutes = [
  "/",
  "/projects",
  "/slides",
  "/friends",
  "/appreciate",
  "/feedback",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }))
}
