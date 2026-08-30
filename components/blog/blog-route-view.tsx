"use client"

import { useEffect, useState } from "react"
import { AlertCircle, LoaderCircle } from "lucide-react"

import { blogPostAPI, blogPostsAPI } from "@/api"
import { BlogArticleHeader } from "@/components/blog/blog-article-header"
import { BlogEngagement } from "@/components/blog/blog-engagement"
import { BlogIndexView } from "@/components/blog/blog-index-view"
import { MarkdownContent } from "@/components/blog/markdown-content"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { BlogPostData } from "@/types/api"

type BlogRouteState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "index"; posts: BlogPostData[] }
  | { status: "post"; post: BlogPostData }

const currentSlug = () => {
  const path = window.location.pathname.replace(/\/+$/, "")
  if (!path.startsWith("/blog/")) return ""
  try {
    return decodeURIComponent(path.slice("/blog/".length))
  } catch {
    return path.slice("/blog/".length)
  }
}

function updateDocumentMetadata(post?: BlogPostData) {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    ?? Object.assign(document.createElement("link"), { rel: "canonical" })
  canonical.href = post
    ? `https://peacesheep.xyz/blog/${encodeURIComponent(post.slug)}`
    : "https://peacesheep.xyz/blog"
  if (!canonical.isConnected) document.head.append(canonical)

  document.title = post ? `${post.title} | PeaceSheep` : "博客 | PeaceSheep"
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (description) {
    description.content = post?.description || "PeaceSheep 关于后端、云原生、分布式系统与 AI 基础设施的文章。"
  }
}

export function BlogRouteView() {
  const [state, setState] = useState<BlogRouteState>({ status: "loading" })

  useEffect(() => {
    let active = true
    const slug = currentSlug()
    const load = async () => {
      try {
        if (slug) {
          const response = await blogPostAPI(slug)
          if (!active) return
          if (response.code !== 0 || !response.data) throw new Error(response.message || "文章不存在")
          updateDocumentMetadata(response.data)
          setState({ status: "post", post: response.data })
          return
        }
        const response = await blogPostsAPI("pageSize=100")
        if (!active) return
        if (response.code !== 0 || !response.data) throw new Error(response.message || "文章列表加载失败")
        updateDocumentMetadata()
        setState({ status: "index", posts: response.data.items ?? [] })
      } catch (error) {
        if (!active) return
        setState({ status: "error", message: error instanceof Error ? error.message : "博客加载失败" })
      }
    }
    void load()
    return () => { active = false }
  }, [])

  if (state.status === "loading") {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" />正在加载博客…
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto w-full max-w-4xl py-12">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>博客加载失败</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (state.status === "index") return <BlogIndexView posts={state.posts} />

  return (
    <div className="mx-auto w-full max-w-4xl py-10 md:py-14">
      <BlogArticleHeader post={state.post} />
      <MarkdownContent content={state.post.contentMarkdown ?? ""} />
      <BlogEngagement post={state.post} />
    </div>
  )
}
