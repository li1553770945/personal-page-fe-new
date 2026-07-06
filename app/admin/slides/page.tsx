"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { ExternalLink, Loader2, LockKeyhole, Pencil, Plus, Presentation, RefreshCw, ShieldAlert, Trash2, Upload } from "lucide-react"

import { adminSlidesAPI, createSlideAPI, deleteSlideAPI, updateSlideAPI, uploadSlideCoverAPI, uploadSlideDeckAPI } from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { resolveApiRouteUrl } from "@/lib/api-url"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { SaveSlideRequest, SlideData } from "@/types/api"

type SlideFormState = {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  cover: string
  coverObjectPath: string
  entry: string
  objectPrefix: string
  tags: string
  protected: boolean
  password: string
}

const emptyForm: SlideFormState = {
  id: "",
  title: "",
  titleEn: "",
  description: "",
  descriptionEn: "",
  cover: "",
  coverObjectPath: "",
  entry: "",
  objectPrefix: "",
  tags: "",
  protected: false,
  password: "",
}

const formatTime = (value: number) => {
  if (!value) return "-"
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value * 1000))
}

const toForm = (slide: SlideData): SlideFormState => ({
  id: slide.id,
  title: slide.title,
  titleEn: slide.titleEn ?? "",
  description: slide.description ?? "",
  descriptionEn: slide.descriptionEn ?? "",
  cover: slide.cover ?? "",
  coverObjectPath: slide.coverObjectPath ?? "",
  entry: slide.entry ?? "",
  objectPrefix: slide.objectPrefix ?? "",
  tags: (slide.tags ?? []).join(", "),
  protected: slide.protected,
  password: slide.password ?? "",
})

const splitTags = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const toPayload = (form: SlideFormState): SaveSlideRequest => ({
  id: form.id.trim(),
  title: form.title.trim(),
  titleEn: form.titleEn.trim(),
  description: form.description.trim(),
  descriptionEn: form.descriptionEn.trim(),
  cover: form.cover.trim(),
  coverObjectPath: form.coverObjectPath.trim(),
  entry: form.entry.trim(),
  objectPrefix: form.objectPrefix.trim(),
  tags: splitTags(form.tags),
  protected: form.protected,
  password: form.password.trim(),
})

export default function AdminSlidesPage() {
  const { user, refresh } = useUser()
  const { notificationError, notificationSuccess } = useNotification()
  const [ready, setReady] = useState(false)
  const [slides, setSlides] = useState<SlideData[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editing, setEditing] = useState<SlideData | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SlideData | null>(null)
  const [form, setForm] = useState<SlideFormState>(emptyForm)
  const [formOpen, setFormOpen] = useState(false)
  const [deckFile, setDeckFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const loadSlides = async () => {
    setLoading(true)
    try {
      const res = await adminSlidesAPI()
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      setSlides(res.data ?? [])
    } catch (err: any) {
      notificationError("加载失败", err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh().then((res) => {
      setReady(true)
      if (res.data?.role === "super_admin") {
        void loadSlides()
      }
    })
  }, [])

  const protectedCount = useMemo(() => slides.filter((item) => item.protected).length, [slides])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setDeckFile(null)
    setCoverFile(null)
    setFormOpen(true)
  }

  const openEdit = (slide: SlideData) => {
    setEditing(slide)
    setForm(toForm(slide))
    setDeckFile(null)
    setCoverFile(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setEditing(null)
    setForm(emptyForm)
    setDeckFile(null)
    setCoverFile(null)
    setFormOpen(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.protected && !form.password.trim() && (!editing || !editing.has_password)) {
      notificationError("缺少密码", "受保护的幻灯片必须设置访问密码。")
      return
    }

    setSaving(true)
    try {
      const payload = toPayload(form)
      if (deckFile) {
        const formData = new FormData()
        formData.append("id", payload.id)
        if (editing) {
          formData.append("databaseId", String(editing.database_id))
        }
        formData.append("file", deckFile)
        const uploadRes = await uploadSlideDeckAPI(formData)
        if (uploadRes.code !== 0) {
          throw new Error(uploadRes.message)
        }
        payload.id = uploadRes.data.id ?? payload.id
        payload.entry = uploadRes.data.entry ?? payload.entry
        payload.objectPrefix = uploadRes.data.objectPrefix ?? payload.objectPrefix
      }
      if (coverFile) {
        const formData = new FormData()
        formData.append("id", payload.id)
        if (editing) {
          formData.append("databaseId", String(editing.database_id))
        }
        formData.append("file", coverFile)
        const uploadRes = await uploadSlideCoverAPI(formData)
        if (uploadRes.code !== 0) {
          throw new Error(uploadRes.message)
        }
        payload.id = uploadRes.data.id ?? payload.id
        payload.cover = uploadRes.data.cover ?? payload.cover
        payload.coverObjectPath = uploadRes.data.coverObjectPath ?? payload.coverObjectPath
      }
      const res = editing
        ? await updateSlideAPI(editing.database_id, payload)
        : await createSlideAPI(payload)
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      notificationSuccess(editing ? "已更新幻灯片" : "已新增幻灯片", payload.title)
      closeForm()
      await loadSlides()
    } catch (err: any) {
      notificationError("保存失败", err?.message ?? String(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeletingId(deleteTarget.database_id)
    try {
      const res: any = await deleteSlideAPI(deleteTarget.database_id)
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      notificationSuccess("已删除幻灯片", deleteTarget.title)
      setDeleteTarget(null)
      await loadSlides()
    } catch (err: any) {
      notificationError("删除失败", err?.message ?? String(err))
    } finally {
      setDeletingId(null)
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user?.role !== "super_admin") {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              无权访问
            </CardTitle>
            <CardDescription>只有超级管理员可以查看幻灯片管理。</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-8">
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Presentation className="size-5 text-primary" />
              幻灯片管理
            </CardTitle>
            <CardDescription>
              管理前台讲演列表、对象存储入口和访问密码。当前共 {slides.length} 套，其中 {protectedCount} 套受保护。
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void loadSlides()} disabled={loading}>
              <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
              刷新
            </Button>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              新增
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>访问</TableHead>
                  <TableHead>资源</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="w-[150px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      <Loader2 className="mx-auto mb-2 size-5 animate-spin" />
                      加载中
                    </TableCell>
                  </TableRow>
                ) : slides.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      暂无幻灯片
                    </TableCell>
                  </TableRow>
                ) : (
                  slides.map((slide) => (
                    <TableRow key={slide.database_id}>
                      <TableCell>
                        <div className="font-medium">{slide.title}</div>
                        <div className="text-xs text-muted-foreground">{slide.titleEn || slide.description || "-"}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{slide.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={slide.protected ? "inline-flex items-center gap-1 text-amber-600" : "text-emerald-600"}>
                            {slide.protected ? <LockKeyhole className="size-3.5" /> : null}
                            {slide.protected ? "密码保护" : "公开"}
                          </span>
                          {slide.entry ? (
                            <Button asChild variant="link" size="sm" className="h-auto justify-start px-0 py-0">
                              <a href={resolveApiRouteUrl(slide.entry)} target="_blank" rel="noreferrer">
                                打开入口
                                <ExternalLink className="size-3" />
                              </a>
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[260px] truncate font-mono text-xs text-muted-foreground">
                          {slide.entry ? "已配置入口" : "未上传"}
                          {slide.cover ? " / 有封面" : ""}
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(slide.updated_at)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon-sm" onClick={() => openEdit(slide)} title="编辑">
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(slide)}
                            disabled={deletingId === slide.database_id}
                            title="删除"
                          >
                            {deletingId === slide.database_id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑幻灯片" : "新增幻灯片"}</DialogTitle>
            <DialogDescription>
              密码会加密保存，后台可见并可直接修改。
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slide-id">幻灯片 ID（可选）</Label>
                <Input
                  id="slide-id"
                  value={form.id}
                  onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))}
                  placeholder="2026-employment-experience-sharing"
                />
                <p className="text-xs text-muted-foreground">
                  留空时后端会自动生成；填写时会检查是否重复。
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slide-title">中文标题</Label>
                <Input
                  id="slide-title"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slide-title-en">英文标题</Label>
                <Input
                  id="slide-title-en"
                  value={form.titleEn}
                  onChange={(event) => setForm((current) => ({ ...current, titleEn: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slide-tags">标签</Label>
                <Input
                  id="slide-tags"
                  value={form.tags}
                  onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                  placeholder="分享, 就业"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slide-description">中文描述</Label>
                <Textarea
                  id="slide-description"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slide-description-en">英文描述</Label>
                <Textarea
                  id="slide-description-en"
                  value={form.descriptionEn}
                  onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))}
                />
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="mb-4 flex items-center gap-2">
                <Upload className="size-4 text-primary" />
                <div className="font-medium">资源上传</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slide-deck-file">Slidev 导出 zip</Label>
                  <Input
                    id="slide-deck-file"
                    type="file"
                    accept=".zip,application/zip,application/x-zip-compressed"
                    onChange={(event) => setDeckFile(event.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    上传 build 输出目录压缩包，后端会解压并自动生成访问入口。
                  </p>
                  {deckFile ? <p className="text-xs text-primary">{deckFile.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slide-cover-file">封面图</Label>
                  <Input
                    id="slide-cover-file"
                    type="file"
                    accept="image/*"
                    onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    上传后会作为前台卡片封面展示。
                  </p>
                  {coverFile ? <p className="text-xs text-primary">{coverFile.name}</p> : null}
                </div>
              </div>
              {(form.entry || form.cover) ? (
                <div className="mt-4 space-y-1 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                  {form.entry ? <div className="truncate">当前入口：{form.entry}</div> : null}
                  {form.cover ? <div className="truncate">当前封面：{form.cover}</div> : null}
                </div>
              ) : null}
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="slide-protected">启用访问密码</Label>
                  <p className="text-sm text-muted-foreground">
                    开启后必须设置密码；关闭会清除后端保存的密码哈希。
                  </p>
                </div>
                <Switch
                  id="slide-protected"
                  checked={form.protected}
                  onCheckedChange={(checked) => setForm((current) => ({ ...current, protected: checked }))}
                />
              </div>
              {form.protected ? (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="slide-password">访问密码</Label>
                  <Input
                    id="slide-password"
                    type="text"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder={editing?.has_password ? "旧数据未保存原文时可在这里重新设置" : "请输入访问密码"}
                  />
                </div>
              ) : null}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm} disabled={saving}>
                取消
              </Button>
              <Button type="submit" loading={saving}>
                保存
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除幻灯片</DialogTitle>
            <DialogDescription>
              确定删除「{deleteTarget?.title}」吗？这只会删除后台元数据，不会自动删除对象存储里的实际资源。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deletingId !== null}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={deletingId !== null}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
