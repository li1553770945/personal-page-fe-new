"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowUpRight, BookMarked, CalendarDays, Heart, MessageCircle, Search } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Input } from "@/components/ui/input"
import { resolveApiRouteUrl } from "@/lib/api-url"
import type { BlogPostData } from "@/types/api"

export function BlogIndexView({ posts }: { posts: BlogPostData[] }) {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return posts
    return posts.filter((post) =>
      [post.title, post.description, ...post.categories, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
  }, [posts, query])

  const formatDate = (value?: number) => value
    ? new Intl.DateTimeFormat(i18n.language === "en" ? "en-US" : "zh-CN", {
        year: "numeric", month: "short", day: "numeric",
      }).format(new Date(value * 1000))
    : ""

  return (
    <div className="mx-auto w-full max-w-6xl py-10 md:py-14">
      <div className="mb-9 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:items-end">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><BookMarked className="size-6" /></div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("blog.title")}</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">{t("blog.description")}</p>
          </div>
        </div>
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("blog.search")}
            className="h-11 rounded-xl bg-card/60 pl-9"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card/70 py-16 text-center text-muted-foreground">{t("blog.empty")}</div>
      ) : (
        <div className="grid gap-5">
          {filtered.map((post) => {
            const href = `/blog/${encodeURIComponent(post.slug)}`
            const cover = post.cover ? resolveApiRouteUrl(post.cover) ?? post.cover : ""
            const timestamp = post.publishedAt ?? post.createdAt
            return (
              <article
                key={post.databaseId}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-l-4 border-l-primary/55 bg-card/75 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className={cover ? "grid min-h-[220px] md:grid-cols-[minmax(0,1fr)_280px]" : "min-h-[210px]"}>
                  <div className="flex min-w-0 flex-col p-5 sm:p-6">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary/80">
                      <BookMarked className="size-4" aria-hidden="true" />
                      <span>{post.categories[0] || t("blog.article")}</span>
                    </div>
                    <h2 className="line-clamp-2 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {post.description || t("blog.noDescription")}
                    </p>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-4" aria-hidden="true" />
                          <time dateTime={new Date(timestamp * 1000).toISOString()}>{formatDate(timestamp)}</time>
                        </span>
                        <span className="inline-flex items-center gap-1.5" aria-label={t("blog.likes", { count: post.likeCount ?? 0 })}>
                          <Heart className="size-4" aria-hidden="true" />{post.likeCount ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1.5" aria-label={t("blog.comments", { count: post.commentCount ?? 0 })}>
                          <MessageCircle className="size-4" aria-hidden="true" />{post.commentCount ?? 0}
                        </span>
                      </div>
                      <div className="flex max-w-full flex-wrap justify-end gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-lg border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {cover && (
                    <div className="relative order-first min-h-48 overflow-hidden border-b bg-muted md:order-last md:min-h-full md:border-b-0 md:border-l">
                      <Image
                        src={cover}
                        alt={post.title}
                        fill
                        unoptimized
                        sizes="(max-width: 767px) 100vw, 280px"
                        className="object-cover transition duration-300 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
                      />
                    </div>
                  )}
                </div>
                <Link href={href} className="absolute inset-0 rounded-2xl" aria-label={t("blog.openPost", { title: post.title })}>
                  <span className="sr-only">{t("blog.openPost", { title: post.title })}</span>
                </Link>
                <ArrowUpRight className="pointer-events-none absolute right-5 top-5 size-5 text-muted-foreground/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
