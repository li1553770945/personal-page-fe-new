"use client"

import dynamic from "next/dynamic"

import Header from "@/components/global/header/Header"
import Footer from "@/components/global/footer/Footer"
import { NotificationList } from "@/components/notification-list"
import { ThemeProvider } from "@/components/theme-provider"
import "../lib/i18n"

const Live2D = dynamic(() => import("@/components/live2d/initializer"), { ssr: false })
const ChatDialog = dynamic(() => import("@/components/live2d/chat-dialog"), { ssr: false })

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Header />
      <div className="flex min-h-screen w-full max-w-7xl flex-col bg-background mx-auto">
        <main className="w-full flex-1 px-4 md:px-6">{children}</main>
        <Footer />
      </div>
      <NotificationList />
      <Live2D />
      <ChatDialog />
    </ThemeProvider>
  )
}
