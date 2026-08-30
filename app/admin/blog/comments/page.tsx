"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, Check, Loader2, MessageSquare, RefreshCw, ShieldAlert, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { adminBlogCommentsAPI, reviewBlogCommentAPI } from "@/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { BlogCommentData, BlogCommentStatus } from "@/types/api"

type CommentFilter = BlogCommentStatus | "all"

export default function BlogCommentModerationPage() {
  const { t, i18n } = useTranslation()
  const { user, refresh } = useUser()
  const { notificationError, notificationSuccess } = useNotification()
  const [ready, setReady] = useState(false)
  const [filter, setFilter] = useState<CommentFilter>("pending")
  const [comments, setComments] = useState<BlogCommentData[]>([])
  const [loading, setLoading] = useState(false)
  const [reviewingId, setReviewingId] = useState<number | null>(null)

  const load = async (nextFilter = filter) => {
    setLoading(true)
    try {
      const response = await adminBlogCommentsAPI(nextFilter)
      if (response.code !== 0 || !response.data) throw new Error(response.message)
      setComments(response.data.items ?? [])
    } catch (error) {
      notificationError(t("blogModeration.loadFailed"), error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh().then((result) => {
      setReady(true)
      if (result.data?.role === "super_admin") void load("pending")
    })
    // Authorization is checked once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeFilter = (nextFilter: CommentFilter) => {
    setFilter(nextFilter)
    void load(nextFilter)
  }

  const review = async (comment: BlogCommentData, status: "approved" | "rejected") => {
    setReviewingId(comment.id)
    try {
      const response = await reviewBlogCommentAPI(comment.id, status)
      if (response.code !== 0) throw new Error(response.message)
      notificationSuccess(t("blogModeration.saved"), t(`blogModeration.status.${status}`))
      await load(filter)
    } catch (error) {
      notificationError(t("blogModeration.saveFailed"), error instanceof Error ? error.message : String(error))
    } finally {
      setReviewingId(null)
    }
  }

  const formatTime = (value: number) => new Intl.DateTimeFormat(i18n.language === "en" ? "en-US" : "zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value * 1000))

  if (!ready) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>

  if (user?.role !== "super_admin") {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="size-5 text-destructive" />{t("blogAdmin.forbidden")}</CardTitle><CardDescription>{t("blogAdmin.forbiddenDescription")}</CardDescription></CardHeader></Card>
      </div>
    )
  }

  const filters: CommentFilter[] = ["pending", "approved", "rejected", "all"]

  return (
    <div className="mx-auto w-full max-w-5xl py-8 md:py-12">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-3 -ml-3"><Link href="/admin/blog"><ArrowLeft className="size-4" />{t("blogModeration.back")}</Link></Button>
          <h1 className="flex items-center gap-2 text-2xl font-bold"><MessageSquare className="size-6 text-primary" />{t("blogModeration.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("blogModeration.description")}</p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={cn("size-4", loading && "animate-spin")} />{t("blogAdmin.refresh")}</Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={t("blogModeration.filterLabel")}>
        {filters.map((item) => (
          <Button key={item} type="button" size="sm" variant={filter === item ? "default" : "outline"} onClick={() => changeFilter(item)}>
            {t(`blogModeration.filter.${item}`)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border py-16 text-muted-foreground"><Loader2 className="size-5 animate-spin" />{t("blogModeration.loading")}</div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-16 text-center text-muted-foreground">{t("blogModeration.empty")}</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <Avatar className="size-10 border">
                    <AvatarImage src={comment.authorAvatar} alt={comment.authorNickname} />
                    <AvatarFallback>{comment.authorNickname.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-medium">{comment.authorNickname}</span>
                      <span className="text-xs text-muted-foreground">@{comment.authorUsername}</span>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        comment.status === "approved" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                        comment.status === "rejected" && "bg-destructive/10 text-destructive",
                        comment.status === "pending" && "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      )}>{t(`blogModeration.status.${comment.status ?? "pending"}`)}</span>
                    </div>
                    <Link href={`/blog/${comment.postSlug}`} target="_blank" className="mt-2 block line-clamp-1 text-sm text-primary hover:underline">{comment.postTitle}</Link>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">{comment.content}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{formatTime(comment.createdAt)}{comment.reviewerUsername ? ` · ${t("blogModeration.reviewedBy", { name: comment.reviewerUsername })}` : ""}</p>
                  </div>
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <Button size="sm" disabled={reviewingId === comment.id || comment.status === "approved"} onClick={() => void review(comment, "approved")}><Check className="size-4" />{t("blogModeration.approve")}</Button>
                    <Button size="sm" variant="outline" disabled={reviewingId === comment.id || comment.status === "rejected"} onClick={() => void review(comment, "rejected")}><X className="size-4" />{t("blogModeration.reject")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
