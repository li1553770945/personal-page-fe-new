import { permanentRedirect } from "next/navigation"

export default async function LegacyBlogPage({ params }: { params: Promise<{ legacy: string }> }) {
  const { legacy } = await params
  permanentRedirect(`/blog/${encodeURIComponent(legacy)}`)
}
