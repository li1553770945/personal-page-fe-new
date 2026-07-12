import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "赞赏",
  description: "通过支付宝或微信支持 PeaceSheep 持续创作与维护开源项目。",
  alternates: {
    canonical: "/appreciate",
  },
  openGraph: {
    title: "赞赏 PeaceSheep",
    description: "通过支付宝或微信支持 PeaceSheep 持续创作与维护开源项目。",
    url: "/appreciate",
  },
}

export default function AppreciateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
