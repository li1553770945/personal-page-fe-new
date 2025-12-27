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
    setMounted(true)
  }, [])

  // mounted之前禁止切换
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn("opacity-50 size-9", className)}
        aria-label="Toggle language"
      >
        <Languages className="size-4" />
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
      size="icon"
      onClick={toggleLanguage}
      className={cn(
        "size-9 relative overflow-visible",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors",
        "group",
        className
      )}
      aria-label={isChinese ? "Switch to English" : "切换到中文"}
      title={isChinese ? "Switch to English" : "切换到中文"}
    >
      <Languages className="size-4 transition-transform group-hover:scale-110" />
      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 min-w-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-semibold leading-none border border-background">
        {isChinese ? 'ZH' : 'EN'}
      </span>
    </Button>
  )
}

