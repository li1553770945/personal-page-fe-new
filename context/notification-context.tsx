"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export interface NotificationItem {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  time: string
}

type NotificationInput = Omit<NotificationItem, "id" | "time" | "icon" | "color"> & { 
  time?: string
  icon?: string
  color?: string
}

interface NotificationContextType {
  notifications: NotificationItem[]
  addNotification: (notification: NotificationInput) => void
  removeNotification: (id: string) => void
  success: (title: string, description: string) => void
  error: (title: string, description: string) => void
  warning: (title: string, description: string) => void
  info: (title: string, description: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const addNotification = useCallback((notification: NotificationInput) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification: NotificationItem = {
      ...notification,
      id,
      time: notification.time || "Just now",
    }

    setNotifications((prev) => {
      // Limit to 10 notifications to avoid performance issues
      const updated = [newNotification, ...prev]
      if (updated.length > 10) {
        return updated.slice(0, 10)
      }
      return updated
    })

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }, [removeNotification])

  const success = useCallback((title: string, description: string) => {
    addNotification({
      name: title,
      description,
      icon: "✅",
      color: "#00C9A7",
    })
  }, [addNotification])

  const error = useCallback((title: string, description: string) => {
    addNotification({
      name: title,
      description,
      icon: "🚨",
      color: "#FF3D71",
    })
  }, [addNotification])

  const warning = useCallback((title: string, description: string) => {
    addNotification({
      name: title,
      description,
      icon: "⚠️",
      color: "#FFB800",
    })
  }, [addNotification])

  const info = useCallback((title: string, description: string) => {
    addNotification({
      name: title,
      description,
      icon: "ℹ️",
      color: "#1E86FF",
    })
  }, [addNotification])

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification,
      success,
      error,
      warning,
      info
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
