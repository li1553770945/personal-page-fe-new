"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { Heart, Loader2, MessageCircle, Send } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  blogCommentsAPI,
  blogLikeStateAPI,
  createBlogCommentAPI,
  toggleBlogLikeAPI,
  trackBlogViewAPI,
} from "@/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { BlogCommentData, BlogPostData } from "@/types/api"

const VIEW_WINDOW_MS = 30 * 60 * 1000

export function BlogEngagement({ post }: { post: BlogPostData }) {
  const { t, i18n } = useTranslation()
  const { user } = useUser()
  const { notificationError, notificationInfo, notificationSuccess } = useNotification()
  const [comments, setComments] = useState<BlogCommentData[]>([])
  const [commentCount, setCommentCount] = useState(post.commentCount ?? 0)
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0)
  const [liked, setLiked] = useState(false)
  const [content, setContent] = useState("")
  const [loadingComments, setLoadingComments] = useState(true)
  const [liking, setLiking] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadComments = useCallback(async () => {
    setLoadingComments(true)
    try {
      const response = await blogCommentsAPI(post.slug)
      if (response.code !== 0 || !response.data) throw new Error(response.message)
      setComments(response.data.items ?? [])
      setCommentCount(response.data.total ?? 0)
    } catch (error) {
      notificationError(t("blog.commentsLoadFailed"), error instanceof Error ? error.message : String(error))
    } finally {
      setLoadingComments(false)
    }
  }, [notificationError, post.slug, t])

  useEffect(() => {
    void loadComments()
  }, [loadComments])

  useEffect(() => {
    const storageKey = `blog-view:${post.slug}`
    let shouldTrack = true
    try {
      const previous = Number(sessionStorage.getItem(storageKey) || 0)
      shouldTrack = !previous || Date.now() - previous > VIEW_WINDOW_MS
      if (shouldTrack) sessionStorage.setItem(storageKey, String(Date.now()))
    } catch {
      // A failed storage lookup should not prevent recording a real page view.
    }
    if (shouldTrack) void trackBlogViewAPI(post.slug).catch(() => undefined)
  }, [post.slug])

  useEffect(() => {
    if (!user) {
      setLiked(false)
      return
    }
    let active = true
    blogLikeStateAPI(post.slug).then((response) => {
      if (!active || response.code !== 0 || !response.data) return
      setLiked(response.data.liked)
      setLikeCount(response.data.likeCount)
    }).catch(() => undefined)
    return () => { active = false }
  }, [post.slug, user])

  const toggleLike = async () => {
    if (!user) {
      notificationInfo(t("blog.loginRequired"), t("blog.loginToLike"))
      return
    }
    setLiking(true)
    try {
      const response = await toggleBlogLikeAPI(post.slug)
      if (response.code !== 0 || !response.data) throw new Error(response.message)
      setLiked(response.data.liked)
      setLikeCount(response.data.likeCount)
    } catch (error) {
      notificationError(t("blog.likeFailed"), error instanceof Error ? error.message : String(error))
    } finally {
      setLiking(false)
    }
  }

  const submitComment = async (event: FormEvent) => {
    event.preventDefault()
    if (!user) {
      notificationInfo(t("blog.loginRequired"), t("blog.loginToComment"))
      return
    }
    const normalized = content.trim()
    if (!normalized) return
    setSubmitting(true)
    try {
      const response = await createBlogCommentAPI(post.slug, normalized)
      if (response.code !== 0) throw new Error(response.message)
      setContent("")
      notificationSuccess(t("blog.commentSubmitted"), t("blog.commentPending"))
    } catch (error) {
      notificationError(t("blog.commentFailed"), error instanceof Error ? error.message : String(error))
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (value: number) => new Intl.DateTimeFormat(i18n.language === "en" ? "en-US" : "zh-CN", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value * 1000))

  return (
    <section id="blog-comments" className="mt-12 border-t pt-8" aria-labelledby="blog-comments-title">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card/65 p-4 sm:p-5">
        <div>
          <h2 id="blog-comments-title" className="text-xl font-semibold">{t("blog.discussion")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("blog.discussionDescription")}</p>
        </div>
        <Button
          type="button"
          variant={liked ? "default" : "outline"}
          aria-pressed={liked}
          disabled={liking}
          onClick={() => void toggleLike()}
          className="min-w-28 rounded-full"
        >
          {liking ? <Loader2 className="size-4 animate-spin" /> : <Heart className={cn("size-4", liked && "fill-current")} />}
          {liked ? t("blog.liked") : t("blog.like")} · {likeCount}
        </Button>
      </div>

      {user ? (
        <form onSubmit={(event) => void submitComment(event)} className="mb-9 rounded-2xl border bg-card/45 p-4 sm:p-5">
          <label htmlFor="blog-comment" className="text-sm font-medium">{t("blog.writeComment")}</label>
          <Textarea
            id="blog-comment"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={2000}
            rows={4}
            className="mt-3 min-h-28 resize-y bg-background"
            placeholder={t("blog.commentPlaceholder")}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{t("blog.commentReviewHint")}</p>
            <Button type="submit" disabled={submitting || !content.trim()}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {t("blog.submitComment")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-9 rounded-2xl border border-dashed bg-muted/25 px-5 py-6 text-center text-sm text-muted-foreground">
          {t("blog.loginToComment")}
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="size-5 text-primary" aria-hidden="true" />
        <h3 className="font-semibold">{t("blog.comments", { count: commentCount })}</h3>
      </div>
      {loadingComments ? (
        <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />{t("blog.loadingComments")}</div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground">{t("blog.noComments")}</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-2xl border bg-card/55 p-4 sm:p-5">
              <div className="flex gap-3">
                <Avatar className="size-9 border">
                  <AvatarImage src={comment.authorAvatar} alt={comment.authorNickname} />
                  <AvatarFallback>{comment.authorNickname.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{comment.authorNickname}</p>
                    <time className="text-xs text-muted-foreground" dateTime={new Date(comment.createdAt * 1000).toISOString()}>{formatDate(comment.createdAt)}</time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-foreground/90">{comment.content}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
