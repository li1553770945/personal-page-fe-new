"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Github, Mail, Presentation, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import { useTranslation } from "react-i18next"

import { buttonVariants } from "@/components/ui/button"
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

type HeroAction = {
  label: string
  href: string
  external?: boolean
  variant?: "default" | "outline"
  icon: React.ElementType
}

export function Hero() {
  const { t } = useTranslation()
  const shouldReduceMotion = usePrefersReducedMotion()
  const tags = t("hero.tags", { returnObjects: true }) as string[]

  const actions: HeroAction[] = [
    {
      label: t("hero.actions.blog"),
      href: "/blog",
      icon: BookOpen,
    },
    {
      label: t("hero.actions.slides"),
      href: "/slides",
      variant: "outline",
      icon: Presentation,
    },
    {
      label: t("hero.actions.github"),
      href: "https://github.com/li1553770945",
      external: true,
      variant: "outline",
      icon: Github,
    },
  ]

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="max-w-5xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            <span>{t("hero.eyebrow")}</span>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-4xl text-3xl font-bold leading-[1.2] tracking-[-0.025em] text-foreground md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    buttonVariants({ size: "lg", variant: action.variant ?? "default" }),
                    "justify-start sm:justify-center"
                  )}
                >
                  <Icon className="size-4" />
                  {action.label}
                  <ArrowRight className="size-4" />
                </Link>
              )
            })}
            <Link
              href="mailto:peacesheep@qq.com"
              className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "justify-start sm:justify-center")}
            >
              <Mail className="size-4" />
              {t("hero.actions.contact")}
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-border/80 bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
