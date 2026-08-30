"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Archive,
  Bot,
  Eye,
  FileClock,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Send,
  ShieldAlert,
  Trash2,
  Undo2,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  adminBlogPostsAPI,
  adminBlogRevisionsAPI,
  aiChatAPI,
  archiveBlogPostAPI,
  confirmBlogAssetAPI,
  createBlogPostAPI,
  deleteBlogPostAPI,
  restoreBlogRevisionAPI,
  saveBlogDraftAPI,
  signBlogAssetAPI,
  unpublishBlogPostAPI,
} from "@/api"
import { MarkdownContent } from "@/components/blog/markdown-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { resolveApiRouteUrl } from "@/lib/api-url"
import { cn } from "@/lib/utils"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { BlogPostData, BlogRevisionData, SaveBlogPostRequest } from "@/types/api"

type EditorForm = {
  slug: string
  legacyPermalink: string
  title: string
  description: string
  contentMarkdown: string
  cover: string
  coverObjectPath: string
  categories: string
  tags: string
  changeSummary: string
  aiInstruction: string
}

const emptyForm: EditorForm = {
  slug: "",
  legacyPermalink: "",
  title: "",
  description: "",
  contentMarkdown: "",
  cover: "",
  coverObjectPath: "",
  categories: "",
  tags: "",
  changeSummary: "",
  aiInstruction: "",
}

const splitList = (value: string) => value
  .split(/[,，]/)
  .map((item) => item.trim())
  .filter(Boolean)

const formFromRevision = (post: BlogPostData, revision: BlogRevisionData): EditorForm => ({
  slug: post.slug,
  legacyPermalink: post.legacyPermalink ?? "",
  title: revision.title,
  description: revision.description,
  contentMarkdown: revision.contentMarkdown,
  cover: revision.cover ?? "",
  coverObjectPath: revision.coverObjectPath ?? "",
  categories: revision.categories.join(", "),
  tags: revision.tags.join(", "),
  changeSummary: "",
  aiInstruction: "",
})

const imageDimensions = async (file: File) => {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file)
    const size = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return size
  }
  const source = URL.createObjectURL(file)
  try {
    return await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new window.Image()
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
      image.onerror = reject
      image.src = source
    })
  } finally {
    URL.revokeObjectURL(source)
  }
}

export default function AdminBlogPage() {
  const { t, i18n } = useTranslation()
  const { user, refresh } = useUser()
  const { notificationError, notificationSuccess, notificationInfo } = useNotification()
  const [ready, setReady] = useState(false)
  const [posts, setPosts] = useState<BlogPostData[]>([])
  const [selected, setSelected] = useState<BlogPostData | null>(null)
  const [revisions, setRevisions] = useState<BlogRevisionData[]>([])
  const [form, setForm] = useState<EditorForm>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const notifyFailure = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    notificationError(t("blogAdmin.operationFailed"), message)
  }

  const openPost = async (post: BlogPostData) => {
    setSelected(post)
    setLoading(true)
    try {
      const response = await adminBlogRevisionsAPI(post.databaseId)
      if (response.code !== 0) throw new Error(response.message)
      const history = response.data ?? []
      setRevisions(history)
      const current = history.find((item) => item.revisionId === post.draftRevisionId) ?? history[0]
      if (current) setForm(formFromRevision(post, current))
    } catch (error) {
      notifyFailure(error)
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async (selectedId?: number) => {
    setLoading(true)
    try {
      const response = await adminBlogPostsAPI()
      if (response.code !== 0) throw new Error(response.message)
      const nextPosts = response.data?.items ?? []
      setPosts(nextPosts)
      const id = selectedId ?? selected?.databaseId
      if (id) {
        const current = nextPosts.find((post) => post.databaseId === id)
        if (current) await openPost(current)
      }
    } catch (error) {
      notifyFailure(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh().then((result) => {
      setReady(true)
      if (result.data?.role === "super_admin") void loadPosts()
    })
    // The initial authorization check intentionally runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const newPost = () => {
    setSelected(null)
    setRevisions([])
    setForm(emptyForm)
  }

  const payload = (publishAfterSave: boolean): SaveBlogPostRequest => ({
    slug: form.slug.trim(),
    legacyPermalink: form.legacyPermalink.trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    contentMarkdown: form.contentMarkdown,
    cover: form.cover.trim(),
    coverObjectPath: form.coverObjectPath.trim(),
    categories: splitList(form.categories),
    tags: splitList(form.tags),
    changeSummary: form.changeSummary.trim(),
    baseRevisionId: selected?.draftRevisionId,
    publishAfterSave,
  })

  const save = async (publishAfterSave: boolean) => {
    setSaving(true)
    try {
      const response = selected
        ? await saveBlogDraftAPI(selected.databaseId, payload(publishAfterSave))
        : await createBlogPostAPI(payload(publishAfterSave))
      if (response.code !== 0) throw new Error(response.message)
      notificationSuccess(
        publishAfterSave ? t("blogAdmin.published") : t("blogAdmin.saved"),
        response.data.title
      )
      await loadPosts(response.data.databaseId)
    } catch (error) {
      notifyFailure(error)
    } finally {
      setSaving(false)
    }
  }

  const mutateStatus = async (action: "unpublish" | "archive") => {
    if (!selected) return
    setSaving(true)
    try {
      const response = action === "unpublish"
        ? await unpublishBlogPostAPI(selected.databaseId)
        : await archiveBlogPostAPI(selected.databaseId)
      if (response.code !== 0) throw new Error(response.message)
      notificationSuccess(t(action === "unpublish" ? "blogAdmin.unpublished" : "blogAdmin.archived"), form.title)
      await loadPosts(selected.databaseId)
    } catch (error) {
      notifyFailure(error)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!selected || !window.confirm(t("blogAdmin.deleteConfirm", { title: form.title }))) return
    setSaving(true)
    try {
      const response = await deleteBlogPostAPI(selected.databaseId)
      if (response.code !== 0) throw new Error(response.message)
      notificationSuccess(t("blogAdmin.deleted"), form.title)
      newPost()
      await loadPosts()
    } catch (error) {
      notifyFailure(error)
    } finally {
      setSaving(false)
    }
  }

  const restore = async (revision: BlogRevisionData) => {
    if (!selected) return
    setSaving(true)
    try {
      const response = await restoreBlogRevisionAPI(selected.databaseId, revision.revisionId)
      if (response.code !== 0) throw new Error(response.message)
      notificationSuccess(t("blogAdmin.restored"), t("blogAdmin.version", { version: revision.version }))
      await loadPosts(selected.databaseId)
    } catch (error) {
      notifyFailure(error)
    } finally {
      setSaving(false)
    }
  }

  const insertMarkdown = (markdown: string) => {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? form.contentMarkdown.length
    const end = textarea?.selectionEnd ?? start
    setForm((current) => ({
      ...current,
      contentMarkdown: `${current.contentMarkdown.slice(0, start)}${markdown}${current.contentMarkdown.slice(end)}`,
    }))
    requestAnimationFrame(() => {
      textarea?.focus()
      textarea?.setSelectionRange(start + markdown.length, start + markdown.length)
    })
  }

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!selected) {
      notificationInfo(t("blogAdmin.saveFirst"), t("blogAdmin.saveFirstDescription"))
      return
    }
    setUploading(true)
    try {
      const signed = await signBlogAssetAPI({
        postId: selected.databaseId,
        fileName: file.name,
        mimeType: file.type || "image/jpeg",
        size: file.size,
      })
      if (signed.code !== 0 || !signed.data.signedUrl) throw new Error(signed.message)
      const upload = await fetch(signed.data.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      })
      if (!upload.ok) throw new Error(`${upload.status} ${upload.statusText}`)
      const size = await imageDimensions(file)
      const alt = file.name.replace(/\.[^.]+$/, "")
      const confirmed = await confirmBlogAssetAPI(signed.data.id, { ...size, alt })
      if (confirmed.code !== 0) throw new Error(confirmed.message)
      const url = resolveApiRouteUrl(confirmed.data.url) ?? confirmed.data.url
      insertMarkdown(`\n![${alt}](${url})\n`)
      notificationSuccess(t("blogAdmin.imageUploaded"), file.name)
    } catch (error) {
      notifyFailure(error)
    } finally {
      setUploading(false)
    }
  }

  const generateWithAI = async () => {
    const instruction = form.aiInstruction.trim()
    if (!instruction) {
      notificationInfo(t("blogAdmin.aiInstruction"), t("blogAdmin.aiInstructionHint"))
      return
    }
    setGenerating(true)
    let result = ""
    const prompt = i18n.language === "en"
      ? `You are assisting with a technical blog post. Follow this instruction: ${instruction}\nTitle: ${form.title}\nExisting draft:\n${form.contentMarkdown.slice(-6000)}\nReturn Markdown only.`
      : `你正在协助编写一篇技术博客。请完成这个要求：${instruction}\n标题：${form.title}\n现有草稿：\n${form.contentMarkdown.slice(-6000)}\n只返回可直接插入的 Markdown 正文。`
    try {
      await aiChatAPI({ message: prompt }, {
        onMessage: (message) => { result += message.data ?? "" },
        onFinished: () => undefined,
        onError: (error) => { throw error },
      })
      if (!result.trim()) throw new Error(t("blogAdmin.aiEmpty"))
      insertMarkdown(`\n\n${result.trim()}\n`)
      notificationSuccess(t("blogAdmin.aiDone"), t("blogAdmin.aiInserted"))
    } catch (error) {
      notifyFailure(error)
    } finally {
      setGenerating(false)
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

  return (
    <div className="mx-auto w-full max-w-7xl py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("blogAdmin.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("blogAdmin.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void loadPosts()} disabled={loading}><RefreshCw className={cn("size-4", loading && "animate-spin")} />{t("blogAdmin.refresh")}</Button>
          <Button onClick={newPost}><Plus className="size-4" />{t("blogAdmin.newPost")}</Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="h-fit xl:sticky xl:top-20">
          <CardHeader><CardTitle className="text-base">{t("blogAdmin.posts", { count: posts.length })}</CardTitle></CardHeader>
          <CardContent className="max-h-[70vh] space-y-2 overflow-y-auto">
            {posts.map((post) => (
              <button
                key={post.databaseId}
                type="button"
                onClick={() => void openPost(post)}
                className={cn("w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent", selected?.databaseId === post.databaseId && "border-primary bg-primary/5")}
              >
                <span className="line-clamp-2 text-sm font-medium">{post.title}</span>
                <span className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{t(`blogAdmin.status.${post.status}`)}</span><span>v{post.version}</span>
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>{selected ? t("blogAdmin.editPost") : t("blogAdmin.createPost")}</CardTitle>
              <CardDescription>{selected ? t("blogAdmin.editDescription", { version: selected.version }) : t("blogAdmin.createDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2"><Label htmlFor="blog-title">{t("blogAdmin.fields.title")}</Label><Input id="blog-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="blog-slug">{t("blogAdmin.fields.slug")}</Label><Input id="blog-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-post" /></div>
                <div className="space-y-2"><Label htmlFor="blog-legacy">{t("blogAdmin.fields.legacyPermalink")}</Label><Input id="blog-legacy" value={form.legacyPermalink} onChange={(e) => setForm({ ...form, legacyPermalink: e.target.value })} placeholder="/pages/abc123/" /></div>
                <div className="space-y-2 md:col-span-2"><Label htmlFor="blog-description">{t("blogAdmin.fields.description")}</Label><Textarea id="blog-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                <div className="space-y-2"><Label htmlFor="blog-categories">{t("blogAdmin.fields.categories")}</Label><Input id="blog-categories" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="blog-tags">{t("blogAdmin.fields.tags")}</Label><Input id="blog-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
                <div className="space-y-2 md:col-span-2"><Label htmlFor="blog-cover">{t("blogAdmin.fields.cover")}</Label><Input id="blog-cover" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} /></div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <Label htmlFor="blog-ai">{t("blogAdmin.aiInstruction")}</Label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Input id="blog-ai" value={form.aiInstruction} onChange={(e) => setForm({ ...form, aiInstruction: e.target.value })} placeholder={t("blogAdmin.aiInstructionHint")} />
                  <Button type="button" variant="secondary" loading={generating} onClick={() => void generateWithAI()}><Bot className="size-4" />{t("blogAdmin.aiWrite")}</Button>
                </div>
              </div>

              <Tabs defaultValue="edit">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <TabsList><TabsTrigger value="edit">{t("blogAdmin.edit")}</TabsTrigger><TabsTrigger value="preview">{t("blogAdmin.preview")}</TabsTrigger></TabsList>
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => void uploadImage(event)} />
                    <Button type="button" variant="outline" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}><ImagePlus className="size-4" />{t("blogAdmin.uploadImage")}</Button>
                  </div>
                </div>
                <TabsContent value="edit"><Textarea ref={textareaRef} value={form.contentMarkdown} onChange={(e) => setForm({ ...form, contentMarkdown: e.target.value })} className="min-h-[520px] font-mono text-sm leading-6" placeholder={t("blogAdmin.markdownPlaceholder")} /></TabsContent>
                <TabsContent value="preview"><div className="min-h-[520px] rounded-lg border bg-background p-5"><MarkdownContent content={form.contentMarkdown} /></div></TabsContent>
              </Tabs>

              <div className="space-y-2"><Label htmlFor="blog-summary">{t("blogAdmin.fields.changeSummary")}</Label><Input id="blog-summary" value={form.changeSummary} onChange={(e) => setForm({ ...form, changeSummary: e.target.value })} placeholder={t("blogAdmin.changeSummaryHint")} /></div>

              <div className="flex flex-wrap gap-2 border-t pt-5">
                <Button loading={saving} onClick={() => void save(false)}><Save className="size-4" />{t("blogAdmin.saveDraft")}</Button>
                <Button variant="secondary" loading={saving} onClick={() => void save(true)}><Send className="size-4" />{t("blogAdmin.saveAndPublish")}</Button>
                {selected?.status === "published" && <Button variant="outline" disabled={saving} onClick={() => void mutateStatus("unpublish")}><Eye className="size-4" />{t("blogAdmin.unpublish")}</Button>}
                {selected && <Button variant="outline" disabled={saving} onClick={() => void mutateStatus("archive")}><Archive className="size-4" />{t("blogAdmin.archive")}</Button>}
                {selected?.status === "published" && <Button asChild variant="outline"><Link href={`/blog/${selected.slug}`} target="_blank"><Eye className="size-4" />{t("blogAdmin.view")}</Link></Button>}
                {selected && <Button variant="destructive" disabled={saving} onClick={() => void remove()}><Trash2 className="size-4" />{t("blogAdmin.delete")}</Button>}
              </div>
            </CardContent>
          </Card>

          {selected && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileClock className="size-5" />{t("blogAdmin.history")}</CardTitle><CardDescription>{t("blogAdmin.historyDescription")}</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                {revisions.map((revision) => (
                  <div key={revision.revisionId} className="flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center">
                    <div><p className="text-sm font-medium">{t("blogAdmin.version", { version: revision.version })} · {revision.title}</p><p className="mt-1 text-xs text-muted-foreground">{formatTime(revision.createdAt)} · {revision.authorUsername} · {revision.changeSummary || t("blogAdmin.noSummary")}</p></div>
                    <Button size="sm" variant="outline" disabled={saving || revision.revisionId === selected.draftRevisionId} onClick={() => void restore(revision)}><Undo2 className="size-4" />{t("blogAdmin.restore")}</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
