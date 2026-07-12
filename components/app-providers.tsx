"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { MotionConfig } from "motion/react"

import Header from "@/components/global/header/Header"
import Footer from "@/components/global/footer/Footer"
import { NotificationList } from "@/components/notification-list"
import { ThemeProvider } from "@/components/theme-provider"
import { useUser } from "@/store/user"
import "../lib/i18n"

const Live2D = dynamic(() => import("@/components/live2d/initializer"), { ssr: false })
const ChatDialog = dynamic(() => import("@/components/live2d/chat-dialog"), { ssr: false })

function DeferredLive2D() {
  const [shouldLoad, setShouldLoad] = useState(false)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    let delayId: number | undefined
    let idleId: number | undefined

    const cancelScheduledLoad = () => {
      if (delayId !== undefined) {
        window.clearTimeout(delayId)
        delayId = undefined
      }
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId)
        idleId = undefined
      }
    }

    const scheduleLoad = () => {
      cancelScheduledLoad()

      if (hasLoadedRef.current) {
        return
      }

      // Keep the model bundle and textures out of the critical first-render path.
      delayId = window.setTimeout(() => {
        const load = () => {
          hasLoadedRef.current = true
          setShouldLoad(true)
        }

        if ("requestIdleCallback" in window) {
          idleId = window.requestIdleCallback(load, { timeout: 2000 })
        } else {
          load()
        }
      }, 1200)
    }

    scheduleLoad()

    return () => {
      cancelScheduledLoad()
    }
  }, [])

  return shouldLoad ? <Live2D /> : null
}

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useUser()
  const chatOwner = user?.id ? `user:${user.id}` : "anonymous"

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <Header />
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-background">
          <main className="w-full flex-1 px-4 md:px-6">{children}</main>
          <Footer />
        </div>
        <NotificationList />
        <DeferredLive2D />
        <ChatDialog key={chatOwner} />
      </MotionConfig>
    </ThemeProvider>
  )
}
