"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // mounted之前禁止切换
  if (!mounted) {
    return <Switch disabled className="opacity-50" />
  }

  // 是否使用深色模式
  const isDark = !!(resolvedTheme === "dark")

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      // 指定按钮图标
      thumbContent={
        isDark ? (
          <Moon className="size-3 text-foreground" />
        ) : (
          <Sun className="size-3 text-foreground" />
        )
      }
      aria-label="Toggle theme"
    />
  )
}
