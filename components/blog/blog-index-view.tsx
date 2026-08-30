"use client"

import { useMemo, useState } from "react"
import { BookOpen, CalendarDays, Search } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
        year: "numeric", month: "long", day: "numeric",
      }).format(new Date(value * 1000))
    : ""

  return (
    <div className="mx-auto w-full max-w-5xl py-10 md:py-14">
      <div className="mb-9 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><BookOpen className="size-6" /></div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("blog.title")}</h1>
            <p className="mt-1 text-muted-foreground">{t("blog.description")}</p>
          </div>
        </div>
        <label className="relative block max-w-xl">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("blog.search")}
            className="pl-9"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-14 text-center text-muted-foreground">{t("blog.empty")}</CardContent></Card>
      ) : (
        <div className="grid gap-5">
          {filtered.map((post) => (
            <Card key={post.databaseId} className="group transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  <time dateTime={new Date((post.publishedAt ?? post.createdAt) * 1000).toISOString()}>
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </time>
                  {post.categories.map((category) => (
                    <span key={category} className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{category}</span>
                  ))}
                </div>
                <CardTitle className="text-xl group-hover:text-primary">
                  <a href={`/blog/${encodeURIComponent(post.slug)}`}>{post.title}</a>
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm leading-6">{post.description}</CardDescription>
              </CardHeader>
              {post.tags.length > 0 && (
                <CardContent className="flex flex-wrap gap-2 pt-0">
                  {post.tags.map((tag) => <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>)}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
