"use client"

import { FormEvent, Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LockKeyhole, Loader2 } from "lucide-react"

import { unlockSlideAPI } from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNotification } from "@/store/notification"

function ProtectedSlideUnlock() {
  const searchParams = useSearchParams()
  const { notificationError } = useNotification()
  const slideId = useMemo(() => searchParams.get("id")?.trim() ?? "", [searchParams])
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!slideId) {
      notificationError("缺少幻灯片 ID", "请从幻灯片列表重新打开。")
      return
    }
    setSubmitting(true)
    try {
      const res = await unlockSlideAPI(slideId, password)
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      const entry = res.data?.entry || `/slides/decks/${slideId}/`
      window.sessionStorage.setItem(`protected-slide:${slideId}`, "ok")
      window.location.assign(entry)
    } catch (err: any) {
      notificationError("解锁失败", err?.message ?? String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-10">
      <Card className="w-full border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
            <LockKeyhole className="size-6" />
          </div>
          <CardTitle className="text-2xl">访问受保护的幻灯片</CardTitle>
          <CardDescription>{slideId || "未指定幻灯片 ID"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-label="访问密码"
              placeholder="请输入访问密码"
            />
            <Button type="submit" className="w-full" disabled={submitting || !password || !slideId}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
              解锁
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default function ProtectedSlidePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <ProtectedSlideUnlock />
    </Suspense>
  )
}
