"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Github, Mail, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import { useTranslation } from "react-i18next"

import { buttonVariants } from "@/components/ui/button"
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
  const tags = t("hero.tags", { returnObjects: true }) as string[]

  const actions: HeroAction[] = [
    {
      label: t("hero.actions.blog"),
      href: "https://blog.peacesheep.xyz",
      external: true,
      icon: BookOpen,
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
    <section className="relative overflow-hidden py-10 md:py-14">
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="size-4 text-primary" />
            <span>{t("hero.eyebrow")}</span>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-2xl font-bold leading-snug tracking-normal text-foreground md:text-3xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
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
                className="rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-sm font-medium text-secondary-foreground"
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
