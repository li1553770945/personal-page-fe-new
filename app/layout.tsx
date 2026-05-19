import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { AppProviders } from "@/components/app-providers"
import "./globals.css"

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://peacesheep.xyz")
const siteTitle = "PeaceSheep 的个人主页"
const siteDescription =
  "PeaceSheep 的个人网站，记录后端、分布式系统、云原生、AI 基础设施相关的经历、文章、分享、项目和工具。"
const ogImage = "/og-image.png"

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: "%s | PeaceSheep",
  },
  description: siteDescription,
  applicationName: "PeaceSheep",
  authors: [{ name: "PeaceSheep", url: siteUrl }],
  creator: "PeaceSheep",
  publisher: "PeaceSheep",
  keywords: [
    "PeaceSheep",
    "后端开发",
    "分布式系统",
    "云原生",
    "Go",
    "Kubernetes",
    "AI Infra",
    "MCP",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "PeaceSheep",
    title: siteTitle,
    description: siteDescription,
    locale: "zh_CN",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "PeaceSheep 的个人主页",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
