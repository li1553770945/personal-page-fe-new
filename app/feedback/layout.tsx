import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "咨询与留言",
  description: "向 PeaceSheep 提交咨询、建议或留言，并查询回复进度。",
  alternates: {
    canonical: "/feedback",
  },
  openGraph: {
    title: "联系 PeaceSheep",
    description: "向 PeaceSheep 提交咨询、建议或留言，并查询回复进度。",
    url: "/feedback",
  },
}

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
