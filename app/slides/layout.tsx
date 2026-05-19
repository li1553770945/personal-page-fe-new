import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "公开分享",
  description: "PeaceSheep 的公开幻灯片、技术分享和经验复盘。",
  alternates: {
    canonical: "/slides",
  },
  openGraph: {
    title: "PeaceSheep 的公开分享",
    description: "PeaceSheep 的公开幻灯片、技术分享和经验复盘。",
    url: "/slides",
  },
}

export default function SlidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
