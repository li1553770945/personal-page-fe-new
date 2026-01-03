"use client"

import { create } from "zustand"

export interface NotificationItem {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  time?: string
}

type NotificationInput = Omit<NotificationItem, "id" | "time" | "icon" | "color"> & {
  time?: string
  icon?: string
  color?: string
}

type State = {
  notifications: NotificationItem[]
}

type Actions = {
  addNotification: (n: NotificationInput) => void
  removeNotification: (id: string) => void
  success: (title: string, description: string) => void
  error: (title: string, description: string) => void
  warning: (title: string, description: string) => void
  info: (title: string, description: string) => void
}

const useNotificationStore = create<State & Actions>((set, get) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification: NotificationItem = {
      ...notification,
      id,
      time: notification.time,
    }
    const prev = get().notifications
    const updated = [newNotification, ...prev].slice(0, 10)
    set({ notifications: updated })
    setTimeout(() => {
      get().removeNotification(id)
    }, 5000)
  },
  removeNotification: (id) => {
    const prev = get().notifications
    set({ notifications: prev.filter((n) => n.id !== id) })
  },
  success: (title, description) => {
    get().addNotification({ name: title, description, icon: "✅", color: "#00C9A7" })
  },
  error: (title, description) => {
    get().addNotification({ name: title, description, icon: "🚨", color: "#FF3D71" })
  },
  warning: (title, description) => {
    get().addNotification({ name: title, description, icon: "⚠️", color: "#FFB800" })
  },
  info: (title, description) => {
    get().addNotification({ name: title, description, icon: "ℹ️", color: "#1E86FF" })
  },
}))

export function useNotification() {
  const notifications = useNotificationStore((s) => s.notifications)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const removeNotification = useNotificationStore((s) => s.removeNotification)
  const notificationSuccess = useNotificationStore((s) => s.success)
  const notificationError = useNotificationStore((s) => s.error)
  const notificationWarning = useNotificationStore((s) => s.warning)
  const notificationInfo = useNotificationStore((s) => s.info)
  return { notifications, addNotification, removeNotification, notificationSuccess, notificationError, notificationWarning, notificationInfo }
}
