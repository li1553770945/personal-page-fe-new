import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "朋友们",
  description: "PeaceSheep 的朋友与独立开发者伙伴链接。",
  alternates: {
    canonical: "/friends",
  },
  openGraph: {
    title: "PeaceSheep 的朋友们",
    description: "PeaceSheep 的朋友与独立开发者伙伴链接。",
    url: "/friends",
  },
}

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
