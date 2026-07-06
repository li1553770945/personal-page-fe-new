"use client"

import { FormEvent, useState } from "react"
import { LockKeyhole, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const deckPath = "/slides/decks/2026-employment-experience-sharing/"
const storageKey = "protected-slide:2026-employment-experience-sharing"
const passwordHash = "bd6a456b833f7c6f1bfd7afb5472f85f641a5ac425210c8a54a16848f329474a"

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function getNextPath() {
  const next = new URLSearchParams(window.location.search).get("next")
  if (!next?.startsWith("/slides/decks/2026-employment-experience-sharing/")) {
    return deckPath
  }
  return next
}

export default function ProtectedEmploymentSharingPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const hash = await sha256(password)
      if (hash !== passwordHash) {
        setError("密码不正确")
        return
      }

      window.sessionStorage.setItem(storageKey, "ok")
      window.location.assign(getNextPath())
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
          <CardTitle className="text-2xl">2026就业经验分享</CardTitle>
          <CardDescription>请输入访问密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-label="访问密码"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={submitting || !password}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
              解锁
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
