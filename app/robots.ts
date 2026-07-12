import type { MetadataRoute } from "next"

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://peacesheep.xyz")

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/home",
        "/chat",
        "/files",
        "/usage/",
        "/feedback/read-feedback",
        "/feedback/unread",
        "/slides/protected",
      ],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl.origin,
  }
}
