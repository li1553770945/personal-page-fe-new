"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Presentation, Search } from "lucide-react"
import type { SlideDeckMeta, SlidesManifest } from "@/types/slides"
import { cn } from "@/lib/utils"

function defaultEntry(id: string) {
  return `/slides/decks/${id}/`
}

/**
 * 使用「目录 + /」作为入口，避免 URL 里带 index.html（Slidev 会把它当成路由片段导致 404）。
 * Next 通过 next.config rewrites fallback 把无文件的子路径回退到各套的 index.html。
 */
function normalizeEntry(id: string, entry?: string) {
  const raw = (entry ?? defaultEntry(id)).trim()
  if (/^https?:\/\//i.test(raw)) {
    return raw
  }
  if (raw.endsWith(".html")) {
    const without = raw.replace(/\/index\.html$/i, "").replace(/\/+$/, "")
    return `${without}/`
  }
  const base = raw.replace(/\/+$/, "")
  return `${base}/`
}

function matchesQuery(deck: SlideDeckMeta, q: string, langIsEn: boolean) {
  if (!q.trim()) return true
  const needle = q.trim().toLowerCase()
  const title = (langIsEn && deck.titleEn ? deck.titleEn : deck.title).toLowerCase()
  const desc = (langIsEn && deck.descriptionEn ? deck.descriptionEn : deck.description).toLowerCase()
  const hay = [
    deck.id,
    deck.title,
    deck.titleEn ?? "",
    deck.description,
    deck.descriptionEn ?? "",
    title,
    desc,
    ...(deck.tags ?? []),
  ]
    .join(" ")
    .toLowerCase()
  return hay.includes(needle)
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function SlidesPage() {
  const { t, i18n } = useTranslation()
  const langIsEn = i18n.language?.toLowerCase().startsWith("en")

  const [list, setList] = useState<SlideDeckMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const loadManifest = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/slides/slides-manifest.json", { cache: "no-store" })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as SlidesManifest
      const slides = Array.isArray(data.slides) ? data.slides : []
      slides.sort((a, b) => {
        const ta = Date.parse(a.createdAt)
        const tb = Date.parse(b.createdAt)
        if (Number.isNaN(ta) || Number.isNaN(tb)) return 0
        return tb - ta
      })
      setList(slides)
    } catch {
      setError("load")
      setList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadManifest()
  }, [loadManifest])

  const filtered = useMemo(
    () => list.filter((d) => matchesQuery(d, query, langIsEn)),
    [list, query, langIsEn]
  )

  return (
    <div className="container mx-auto py-10 px-4 min-h-[calc(100vh-4rem)] max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-10 text-center space-y-3"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t("slides.title")}</h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          {t("slides.description")}
        </p>
      </motion.div>

      <div className="mb-8 max-w-xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-9"
          placeholder={t("slides.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t("slides.searchPlaceholder")}
        />
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="size-8 animate-spin" />
          <span className="text-sm">{t("slides.loading")}</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-6 text-center space-y-3">
          <p className="text-sm text-destructive">{t("slides.loadError")}</p>
          <Button variant="outline" size="sm" onClick={() => void loadManifest()}>
            {t("slides.retry")}
          </Button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border bg-card/40 backdrop-blur-sm px-6 py-12 text-center space-y-2">
          <Presentation className="size-10 mx-auto text-muted-foreground opacity-80" />
          <p className="font-medium">{t("slides.noResults")}</p>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{t("slides.howToAdd")}</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {filtered.map((deck) => {
            const title = langIsEn && deck.titleEn ? deck.titleEn : deck.title
            const description =
              langIsEn && deck.descriptionEn ? deck.descriptionEn : deck.description
            const href = normalizeEntry(deck.id, deck.entry)
            const dateLabel = (() => {
              const d = new Date(deck.createdAt)
              if (Number.isNaN(d.getTime())) return deck.createdAt
              return d.toLocaleDateString(langIsEn ? "en-US" : "zh-CN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            })()

            return (
              <motion.div key={deck.id} variants={item}>
                <Card className="h-full overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                  >
                    <div
                      className={cn(
                        "relative aspect-video w-full bg-muted overflow-hidden",
                        !deck.cover && "bg-gradient-to-br from-primary/15 via-muted to-muted"
                      )}
                    >
                      {deck.cover ? (
                        <Image
                          src={deck.cover}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Presentation className="size-14 text-primary/35" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="space-y-1 pb-2">
                      <CardTitle className="text-lg leading-snug line-clamp-2">{title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {t("slides.createdAt")} {dateLabel}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <CardDescription className="text-sm line-clamp-3 min-h-[3.75rem]">
                        {description}
                      </CardDescription>
                      {deck.tags && deck.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {deck.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="inline-flex text-sm font-medium text-primary group-hover:underline">
                        {t("slides.open")} →
                      </span>
                    </CardContent>
                  </a>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
