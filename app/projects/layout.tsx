import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "项目",
  description: "PeaceSheep 参与和主导的工程项目、开源工具和实验性作品。",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "PeaceSheep 的项目",
    description: "PeaceSheep 参与和主导的工程项目、开源工具和实验性作品。",
    url: "/projects",
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
