"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
      // 水合完成后，应用本地存储的语言设置
    const savedLanguage = localStorage.getItem('i18nextLng')
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
    setMounted(true)
  }, [i18n])

  // mounted之前禁止切换
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={cn("h-10 min-w-16 gap-1.5 rounded-lg bg-card px-3 opacity-50", className)}
        aria-label="Toggle language"
      >
        <Languages className="size-4" />
        <span className="text-xs font-semibold">ZH</span>
      </Button>
    )
  }

  const currentLang = i18n.language || 'zh'
  const isChinese = currentLang === 'zh'

  const toggleLanguage = () => {
    const newLanguage = isChinese ? 'en' : 'zh'
    i18n.changeLanguage(newLanguage)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "h-10 min-w-16 gap-1.5 rounded-lg border border-border/80 bg-card px-3",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors",
        "group",
        className
      )}
      aria-label={isChinese ? "Switch to English" : "切换到中文"}
      title={isChinese ? "Switch to English" : "切换到中文"}
    >
      <Languages className="size-4 transition-transform group-hover:scale-110" />
      <span className="text-xs font-semibold">
        {isChinese ? 'ZH' : 'EN'}
      </span>
    </Button>
  )
}

