"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  Bookmark,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  Heart,
  MessageCircle,
  Pin,
  Search,
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

const postTimestamp = (post: BlogPostData) => post.publishedAt ?? post.createdAt

export function BlogIndexView({ posts }: { posts: BlogPostData[] }) {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [tag, setTag] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("pinned")
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const categories = useMemo(() => facetOptions(posts.flatMap((post) => post.categories)), [posts])
  const tags = useMemo(() => facetOptions(posts.flatMap((post) => post.tags)), [posts])
  const shownCategories = showAllCategories ? categories : categories.slice(0, 10)
  const shownTags = showAllTags ? tags : tags.slice(0, 10)
  const selectedCategory = categories.find((item) => item.key === category)?.label
  const selectedTag = tags.find((item) => item.key === tag)?.label
  const hasFilters = Boolean(query.trim() || category || tag)

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (event.key !== "/" || target?.matches("input, textarea, select, [contenteditable='true']")) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener("keydown", focusSearch)
    return () => window.removeEventListener("keydown", focusSearch)
  }, [])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const matches = posts.filter((post) => {
      const searchMatches = !normalizedQuery || [post.title, post.description, ...post.categories, ...post.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery)
      return searchMatches && facetMatches(post.categories, category) && facetMatches(post.tags, tag)
    })

    return [...matches].sort((a, b) => {
      if (sortMode === "pinned" && Boolean(a.pinned) !== Boolean(b.pinned)) {
        return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))
      }
      return postTimestamp(b) - postTimestamp(a)
    })
  }, [posts, query, category, tag, sortMode])

  const resetFilters = () => {
    setQuery("")
    setCategory("")
    setTag("")
  }

  const formatDate = (value?: number) => value
    ? new Intl.DateTimeFormat(i18n.language === "en" ? "en-US" : "zh-CN", {
        year: "numeric", month: "2-digit", day: "2-digit",
      }).format(new Date(value * 1000))
    : ""

  return (
    <div className="mx-auto w-full max-w-[1380px] py-6">
      <div className="grid gap-6 lg:grid-cols-[190px_minmax(0,1fr)] xl:gap-7">
        <aside className="hidden border-r border-border/80 pr-4 lg:block" aria-label={t("blog.categories")}>
          <div className="sticky top-24">
            <div className="mb-2 px-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("blog.categories")}
            </div>
            <div className="grid gap-1">
              <button
                type="button"
                className={cn(
                  "flex min-h-9 w-full items-center justify-between rounded-lg px-2.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  !category && "bg-primary/10 font-semibold text-primary"
                )}
                aria-pressed={!category}
                onClick={() => setCategory("")}
              >
                <span>{t("blog.all")}</span>
                <span className="font-mono text-xs opacity-70">{posts.length}</span>
              </button>
              {shownCategories.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={cn(
                    "flex min-h-9 w-full items-center justify-between rounded-lg px-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    category === item.key && "bg-primary/10 font-semibold text-primary"
                  )}
                  aria-pressed={category === item.key}
                  onClick={() => setCategory(item.key)}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="ml-3 font-mono text-xs opacity-70">{item.count}</span>
                </button>
              ))}
              {categories.length > 10 ? (
                <button
                  type="button"
                  className="mt-1 inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setShowAllCategories((value) => !value)}
                >
                  {showAllCategories ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  {t(showAllCategories ? "blog.fewerCategories" : "blog.moreCategories", { count: categories.length - 10 })}
                </button>
              ) : null}
            </div>

          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(300px,390px)] xl:items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.03em]">{t("blog.title")}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{t("blog.description")}</p>
            </div>
            <label className="relative block xl:mt-1">
              <span className="sr-only">{t("blog.search")}</span>
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("blog.search")}
                className="h-10 rounded-lg bg-card pl-10 pr-11 shadow-none"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">/</kbd>
            </label>
          </div>

          <div className="mb-4 flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-border/80 bg-card/70 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
            <span className="font-medium text-foreground">{t("blog.currentFilter")}</span>
            <span>{selectedCategory ?? t("blog.allCategories")}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedTag ? `#${selectedTag}` : t("blog.allTags")}</span>
            {query.trim() ? <span className="rounded-md bg-secondary px-2 py-1">“{query.trim()}”</span> : null}
            {hasFilters ? (
              <Button size="sm" variant="ghost" className="ml-auto text-primary" onClick={resetFilters}>
                <X className="size-4" />{t("blog.clearFilters")}
              </Button>
            ) : null}
          </div>

          <div className="mb-4 lg:hidden">
            <div className="mb-2 text-sm font-semibold">{t("blog.categories")}</div>
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Button size="sm" variant={!category ? "default" : "outline"} aria-pressed={!category} onClick={() => setCategory("")}>{t("blog.all")}</Button>
              {categories.map((item) => (
                <Button key={item.key} size="sm" variant={category === item.key ? "default" : "outline"} aria-pressed={category === item.key} onClick={() => setCategory(item.key)}>
                  {item.label}<span className="text-xs opacity-60">{item.count}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4 border-b border-border/80 pb-4">
            <div className="flex flex-col gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-sm font-semibold">{t("blog.popularTags")}</span>
                <div className="flex min-w-0 flex-1 flex-nowrap gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
                  <Button size="sm" variant={!tag ? "secondary" : "ghost"} aria-pressed={!tag} onClick={() => setTag("")}>{t("blog.all")}</Button>
                  {shownTags.map((item) => (
                    <Button key={item.key} size="sm" variant={tag === item.key ? "secondary" : "ghost"} aria-pressed={tag === item.key} onClick={() => setTag(item.key)}>
                      #{item.label}<span className="text-xs opacity-60 lg:hidden">{item.count}</span>
                    </Button>
                  ))}
                  {tags.length > 10 ? (
                    <Button size="sm" variant="ghost" aria-label={t(showAllTags ? "blog.fewerTags" : "blog.moreTags", { count: tags.length - 10 })} onClick={() => setShowAllTags((value) => !value)}>
                      {showAllTags ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      <span className="lg:hidden">{t(showAllTags ? "blog.fewerTags" : "blog.moreTags", { count: tags.length - 10 })}</span>
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-medium">{t("blog.sortBy")}</span>
                  <div className="inline-flex rounded-lg border border-border/80 bg-card p-1">
                    <Button size="sm" variant={sortMode === "pinned" ? "secondary" : "ghost"} aria-pressed={sortMode === "pinned"} onClick={() => setSortMode("pinned")}>
                      <Pin className="size-4" />{t("blog.sortPinned")}
                    </Button>
                    <Button size="sm" variant={sortMode === "time" ? "secondary" : "ghost"} aria-pressed={sortMode === "time"} onClick={() => setSortMode("time")}>
                      <Clock3 className="size-4" />{t("blog.sortLatest")}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t("blog.resultCount", { count: filtered.length })}</p>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-card/50 py-20 text-center text-muted-foreground">{t("blog.empty")}</div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((post) => {
                const encodedSlug = encodeURIComponent(post.slug)
                const href = process.env.NODE_ENV === "development"
                  ? `/blog-shell?slug=${encodedSlug}`
                  : `/blog/${encodedSlug}`
                const cover = post.cover ? resolveApiRouteUrl(post.cover) ?? post.cover : ""
                const timestamp = postTimestamp(post)
                return (
                  <article
                    key={post.databaseId}
                    className={cn(
                      "notebook-row group relative grid min-h-[118px] grid-cols-1 items-start gap-x-3 gap-y-2 rounded-xl border border-border/90 bg-card/55 px-3 py-[18px] shadow-[0_1px_0_rgb(15_23_42_/_0.025)] transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-px hover:border-primary/35 hover:bg-card hover:shadow-sm focus-within:border-primary/45 focus-within:bg-card focus-within:shadow-sm motion-reduce:transform-none motion-reduce:transition-none sm:px-4 xl:items-center",
                      post.pinned ? "border-l-[3px] border-l-amber-500/70" : "border-l-[3px] border-l-primary/45",
                      cover
                        ? "xl:grid-cols-[minmax(0,1fr)_15rem_9rem]"
                        : "xl:grid-cols-[minmax(0,1fr)_16rem]"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="relative z-10 mb-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-primary">
                        {post.pinned ? <Bookmark className="mr-0.5 size-3.5 fill-amber-400 text-amber-600 dark:fill-amber-500 dark:text-amber-400" aria-label={t("blog.pinned")} /> : null}
                        {post.categories.length > 0 ? post.categories.map((item) => (
                          <button key={item} type="button" className="rounded px-1 py-0.5 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setCategory(item.trim().toLocaleLowerCase())}>{item}</button>
                        )) : <span>{t("blog.article")}</span>}
                      </div>
                      <h2 className="line-clamp-2 text-base font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-primary md:text-[17px]">{post.title}</h2>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-muted-foreground xl:line-clamp-1">{post.description || t("blog.noDescription")}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground xl:block">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" /><time dateTime={new Date(timestamp * 1000).toISOString()}>{formatDate(timestamp)}</time></span>
                      <span className="inline-flex items-center gap-1.5 xl:ml-4" aria-label={t("blog.likes", { count: post.likeCount ?? 0 })}><Heart className="size-3.5" />{post.likeCount ?? 0}</span>
                      <span className="inline-flex items-center gap-1.5 xl:ml-3" aria-label={t("blog.comments", { count: post.commentCount ?? 0 })}><MessageCircle className="size-3.5" />{post.commentCount ?? 0}</span>
                      {post.tags.length > 0 ? (
                        <div className="relative z-10 flex flex-wrap gap-1.5 xl:mt-2">
                          {post.tags.slice(0, 3).map((item) => (
                            <button key={item} type="button" className="rounded-md border border-border/80 bg-background px-2 py-1 text-[11px] transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setTag(item.trim().toLocaleLowerCase())}>#{item}</button>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {cover ? (
                      <div className="relative min-h-32 overflow-hidden rounded-lg border bg-muted xl:h-20 xl:min-h-0">
                        <Image src={cover} alt="" fill unoptimized sizes="(max-width: 1279px) 100vw, 144px" className="object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none" />
                      </div>
                    ) : null}

                    <Link href={href} className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" aria-label={t("blog.openPost", { title: post.title })}>
                      <span className="sr-only">{t("blog.openPost", { title: post.title })}</span>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
