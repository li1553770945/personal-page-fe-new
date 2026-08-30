"use client"

import Link from "next/link"
import { ArrowLeft, CalendarDays } from "lucide-react"
import { useTranslation } from "react-i18next"

import type { BlogPostData } from "@/types/api"

export function BlogArticleHeader({ post }: { post: BlogPostData }) {
  const { t, i18n } = useTranslation()
  const timestamp = post.publishedAt ?? post.createdAt
  const date = new Intl.DateTimeFormat(i18n.language === "en" ? "en-US" : "zh-CN", {
    year: "numeric", month: "long", day: "numeric",
  }).format(new Date(timestamp * 1000))

  return (
    <header className="mb-9 border-b pb-8">
      <Link href="/blog" className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" />{t("blog.back")}
      </Link>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        <time dateTime={new Date(timestamp * 1000).toISOString()}>{date}</time>
        {post.categories.map((category) => (
          <span key={category} className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{category}</span>
        ))}
      </div>
      <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">{post.title}</h1>
      {post.description && <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{post.description}</p>}
      {post.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => <span key={tag} className="text-sm text-muted-foreground">#{tag}</span>)}
        </div>
      )}
    </header>
  )
}
