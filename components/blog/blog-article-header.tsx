"use client"

import Link from "next/link"
import { ArrowLeft, CalendarDays, Heart, MessageCircle, PencilLine } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { useUser } from "@/store/user"
import type { BlogPostData } from "@/types/api"

export function BlogArticleHeader({ post }: { post: BlogPostData }) {
  const { t, i18n } = useTranslation()
  const { user } = useUser()
  const timestamp = post.publishedAt ?? post.createdAt
  const date = new Intl.DateTimeFormat(i18n.language === "en" ? "en-US" : "zh-CN", {
    year: "numeric", month: "long", day: "numeric",
  }).format(new Date(timestamp * 1000))

  return (
    <header className="mb-10 border-b border-border/80 pb-9">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" />{t("blog.back")}
        </Link>
        {user?.role === "super_admin" && (
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/blog?post=${post.databaseId}`}><PencilLine className="size-4" />{t("blog.editPost")}</Link>
          </Button>
        )}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        <time dateTime={new Date(timestamp * 1000).toISOString()}>{date}</time>
        {post.categories.map((category) => (
          <span key={category} className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">{category}</span>
        ))}
      </div>
      <h1 className="text-3xl font-bold leading-tight tracking-[-0.03em] md:text-5xl">{post.title}</h1>
      {post.description && <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{post.description}</p>}
      {post.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => <span key={tag} className="text-sm text-muted-foreground">#{tag}</span>)}
        </div>
      )}
      <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Heart className="size-4" aria-hidden="true" />{t("blog.likes", { count: post.likeCount ?? 0 })}</span>
        <a href="#blog-comments" className="inline-flex items-center gap-1.5 hover:text-primary"><MessageCircle className="size-4" aria-hidden="true" />{t("blog.comments", { count: post.commentCount ?? 0 })}</a>
      </div>
    </header>
  )
}
