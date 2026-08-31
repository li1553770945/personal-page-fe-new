"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowUpRight,
  BookMarked,
  CalendarDays,
  Clock3,
  Heart,
  MessageCircle,
  Pin,
  Search,
  Tags,
  X,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resolveApiRouteUrl } from "@/lib/api-url"
import { cn } from "@/lib/utils"
import type { BlogPostData } from "@/types/api"

type Facet = { key: string; label: string; count: number }
type SortMode = "pinned" | "time"

const facetOptions = (values: string[]): Facet[] => {
  const items = new Map<string, Facet>()
  values.forEach((value) => {
    const label = value.trim()
    const key = label.toLocaleLowerCase()
    if (!key) return
    const current = items.get(key)
    items.set(key, current ? { ...current, count: current.count + 1 } : { key, label, count: 1 })
  })
  return [...items.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

const facetMatches = (values: string[], selected: string) => !selected
  || values.some((value) => value.trim().toLocaleLowerCase() === selected)

export function BlogIndexView({ posts }: { posts: BlogPostData[] }) {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [tag, setTag] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("pinned")
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  const categories = useMemo(() => facetOptions(posts.flatMap((post) => post.categories)), [posts])
  const tags = useMemo(() => facetOptions(posts.flatMap((post) => post.tags)), [posts])
  const shownCategories = showAllCategories ? categories : categories.slice(0, 12)
  const shownTags = showAllTags ? tags : tags.slice(0, 12)
  const hasFilters = Boolean(query.trim() || category || tag)

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const matches = posts.filter((post) => {
      const searchMatches = !normalizedQuery || [post.title, post.description, ...post.categories, ...post.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery)
      return searchMatches && facetMatches(post.categories, category) && facetMatches(post.tags, tag)
    })
    if (sortMode === "time") {
      return [...matches].sort((a, b) => (b.publishedAt ?? b.createdAt) - (a.publishedAt ?? a.createdAt))
    }
    return matches
  }, [posts, query, category, tag, sortMode])

  const resetFilters = () => {
    setQuery("")
    setCategory("")
    setTag("")
  }

  const formatDate = (value?: number) => value
    ? new Intl.DateTimeFormat(i18n.language === "en" ? "en-US" : "zh-CN", {
        year: "numeric", month: "short", day: "numeric",
      }).format(new Date(value * 1000))
    : ""

  return (
    <div className="mx-auto w-full max-w-6xl py-10 md:py-14">
      <div className="mb-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:items-end">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><BookMarked className="size-6" /></div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("blog.title")}</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">{t("blog.description")}</p>
          </div>
        </div>
        <label className="relative block">
          <span className="sr-only">{t("blog.search")}</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("blog.search")} className="h-11 rounded-xl bg-card/60 pl-9" />
        </label>
      </div>

      <section className="mb-7 rounded-2xl border bg-card/55 p-4 shadow-sm sm:p-5" aria-label={t("blog.filters")}>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="flex w-24 shrink-0 items-center gap-2 pt-1.5 text-sm font-medium"><BookMarked className="size-4 text-primary" />{t("blog.categories")}</div>
            <div className="flex min-w-0 flex-wrap gap-2">
              <Button size="sm" variant={!category ? "default" : "outline"} aria-pressed={!category} onClick={() => setCategory("")}>{t("blog.all")}</Button>
              {shownCategories.map((item) => (
                <Button key={item.key} size="sm" variant={category === item.key ? "default" : "outline"} aria-pressed={category === item.key} onClick={() => setCategory(item.key)}>
                  {item.label}<span className="text-xs opacity-60">{item.count}</span>
                </Button>
              ))}
              {categories.length > 12 && (
                <Button size="sm" variant="ghost" onClick={() => setShowAllCategories((value) => !value)}>
                  {t(showAllCategories ? "blog.fewerCategories" : "blog.moreCategories", { count: categories.length - 12 })}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="flex w-24 shrink-0 items-center gap-2 pt-1.5 text-sm font-medium"><Tags className="size-4 text-primary" />{t("blog.tags")}</div>
            <div className="flex min-w-0 flex-wrap gap-2">
              <Button size="sm" variant={!tag ? "default" : "outline"} aria-pressed={!tag} onClick={() => setTag("")}>{t("blog.all")}</Button>
              {shownTags.map((item) => (
                <Button key={item.key} size="sm" variant={tag === item.key ? "default" : "outline"} aria-pressed={tag === item.key} onClick={() => setTag(item.key)}>
                  #{item.label}<span className="text-xs opacity-60">{item.count}</span>
                </Button>
              ))}
              {tags.length > 12 && (
                <Button size="sm" variant="ghost" onClick={() => setShowAllTags((value) => !value)}>
                  {t(showAllTags ? "blog.fewerTags" : "blog.moreTags", { count: tags.length - 12 })}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 border-t pt-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{t("blog.sortBy")}</span>
              <Button size="sm" variant={sortMode === "pinned" ? "secondary" : "ghost"} aria-pressed={sortMode === "pinned"} onClick={() => setSortMode("pinned")}><Pin className="size-4" />{t("blog.sortPinned")}</Button>
              <Button size="sm" variant={sortMode === "time" ? "secondary" : "ghost"} aria-pressed={sortMode === "time"} onClick={() => setSortMode("time")}><Clock3 className="size-4" />{t("blog.sortLatest")}</Button>
              {hasFilters && <Button size="sm" variant="ghost" onClick={resetFilters}><X className="size-4" />{t("blog.clearFilters")}</Button>}
            </div>
            <p className="text-sm text-muted-foreground sm:ml-auto">{t("blog.resultCount", { count: filtered.length })}</p>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card/70 py-16 text-center text-muted-foreground">{t("blog.empty")}</div>
      ) : (
        <div className="grid gap-5">
          {filtered.map((post) => {
            const href = `/blog/${encodeURIComponent(post.slug)}`
            const cover = post.cover ? resolveApiRouteUrl(post.cover) ?? post.cover : ""
            const timestamp = post.publishedAt ?? post.createdAt
            return (
              <article key={post.databaseId} className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl border border-l-4 bg-card/75 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 motion-reduce:transform-none motion-reduce:transition-none",
                post.pinned ? "border-l-amber-500/80" : "border-l-primary/55"
              )}>
                <div className={cover ? "grid min-h-[220px] md:grid-cols-[minmax(0,1fr)_280px]" : "min-h-[210px]"}>
                  <div className="flex min-w-0 flex-col p-5 sm:p-6">
                    <div className="relative z-10 mb-3 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-primary/80">
                      {post.pinned && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-300"><Pin className="size-3.5" />{t("blog.pinned")}</span>}
                      {post.categories.length > 0 ? post.categories.map((item) => (
                        <button key={item} type="button" className="rounded-full bg-primary/10 px-2.5 py-1 transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setCategory(item.trim().toLocaleLowerCase())}>{item}</button>
                      )) : <span>{t("blog.article")}</span>}
                    </div>
                    <h2 className="line-clamp-2 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-2xl">{post.title}</h2>
                    <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{post.description || t("blog.noDescription")}</p>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" /><time dateTime={new Date(timestamp * 1000).toISOString()}>{formatDate(timestamp)}</time></span>
                        <span className="inline-flex items-center gap-1.5" aria-label={t("blog.likes", { count: post.likeCount ?? 0 })}><Heart className="size-4" />{post.likeCount ?? 0}</span>
                        <span className="inline-flex items-center gap-1.5" aria-label={t("blog.comments", { count: post.commentCount ?? 0 })}><MessageCircle className="size-4" />{post.commentCount ?? 0}</span>
                      </div>
                      <div className="relative z-10 flex max-w-full flex-wrap justify-end gap-2">
                        {post.tags.slice(0, 4).map((item) => (
                          <button key={item} type="button" className="rounded-lg border bg-background/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setTag(item.trim().toLocaleLowerCase())}>#{item}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {cover && (
                    <div className="relative order-first min-h-48 overflow-hidden border-b bg-muted md:order-last md:min-h-full md:border-b-0 md:border-l">
                      <Image src={cover} alt="" fill unoptimized sizes="(max-width: 767px) 100vw, 280px" className="object-cover transition duration-300 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none" />
                    </div>
                  )}
                </div>
                <Link href={href} className="absolute inset-0 rounded-2xl" aria-label={t("blog.openPost", { title: post.title })}><span className="sr-only">{t("blog.openPost", { title: post.title })}</span></Link>
                <ArrowUpRight className="pointer-events-none absolute right-5 top-5 size-5 text-muted-foreground/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transform-none motion-reduce:transition-none" />
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
