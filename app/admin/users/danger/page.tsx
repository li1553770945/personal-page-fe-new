"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  KeyRound,
  Loader2,
  RotateCcw,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react"

import {
  adminUsersAPI,
  deleteTestUserAPI,
  generateCodeAPI,
  regenerateUserActivateCodeAPI,
  resetTestUserAPI,
} from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { AdminUserData, UserDangerActionData } from "@/types/api"

type Operation = "code" | "reset" | "delete"

const getErrorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

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

export default function AdminUsersDangerPage() {
  const { user, refresh } = useUser()
  const { notificationError, notificationSuccess } = useNotification()
  const [ready, setReady] = useState(false)
  const [users, setUsers] = useState<AdminUserData[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [confirmUsername, setConfirmUsername] = useState("")
  const [reason, setReason] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [lastCode, setLastCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [operating, setOperating] = useState<Operation | null>(null)

  const selectedUser = useMemo(
    () => users.find((item) => item.id === selectedId) ?? null,
    [users, selectedId]
  )
  const confirmationMatches = Boolean(selectedUser && confirmUsername.trim() === selectedUser.username)
  const canOperate = Boolean(
    selectedUser &&
    selectedUser.role === "user" &&
    selectedUser.id !== user?.id &&
    confirmationMatches
  )

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminUsersAPI()
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      setUsers(res.data ?? [])
    } catch (err: unknown) {
      notificationError("加载失败", getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [notificationError])

  useEffect(() => {
    refresh().then((res) => {
      setReady(true)
      if (res.data?.role === "super_admin") {
        void loadUsers()
      }
    })
  }, [loadUsers, refresh])

  const selectUser = (target: AdminUserData) => {
    setSelectedId(target.id)
    setConfirmUsername("")
    setReason("")
    setLastCode("")
  }

  const replaceUser = (updated?: AdminUserData) => {
    if (!updated) return
    setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
  }

  const applyResult = (data?: UserDangerActionData) => {
    replaceUser(data?.user)
    setLastCode(data?.activeCode || data?.activate_code || "")
  }

  const dangerPayload = () => ({
    username: confirmUsername.trim(),
    reason: reason.trim(),
  })

  const createTestUser = async () => {
    const username = newUsername.trim()
    if (!username) {
      notificationError("生成失败", "请输入测试用户名")
      return
    }

    setCreating(true)
    try {
      const res = await generateCodeAPI({ username })
      if (res.code !== 0) throw new Error(res.message)
      setLastCode(res.data?.activeCode || res.data?.activate_code || "")
      notificationSuccess("测试用户已预置", username)
      setNewUsername("")
      await loadUsers()
    } catch (err: unknown) {
      notificationError("生成失败", getErrorMessage(err))
    } finally {
      setCreating(false)
    }
  }

  const runOperation = async (operation: Operation) => {
    if (!selectedUser || !canOperate) return
    if (operation === "delete" && !reason.trim()) {
      notificationError("删除失败", "请填写删除原因")
      return
    }

    setOperating(operation)
    try {
      if (operation === "code") {
        const res = await regenerateUserActivateCodeAPI(selectedUser.id, dangerPayload())
        if (res.code !== 0) throw new Error(res.message)
        applyResult(res.data)
        notificationSuccess("激活码已生成", selectedUser.username)
      }

      if (operation === "reset") {
        const res = await resetTestUserAPI(selectedUser.id, dangerPayload())
        if (res.code !== 0) throw new Error(res.message)
        applyResult(res.data)
        notificationSuccess("测试账号已重置", selectedUser.username)
      }

      if (operation === "delete") {
        const res = await deleteTestUserAPI(selectedUser.id, dangerPayload())
        if (res.code !== 0) throw new Error(res.message)
        notificationSuccess("用户已永久删除", selectedUser.username)
        setUsers((current) => current.filter((item) => item.id !== selectedUser.id))
        setSelectedId(null)
        setConfirmUsername("")
        setReason("")
        setLastCode("")
      }
    } catch (err: unknown) {
      notificationError("操作失败", getErrorMessage(err))
    } finally {
      setOperating(null)
    }
  }

  const copyCode = async () => {
    if (!lastCode) return
    await navigator.clipboard.writeText(lastCode)
    notificationSuccess("已复制激活码", lastCode)
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
            <CardDescription>只有超级管理员可以访问用户危险区。</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 px-0">
            <Link href="/admin/users">
              <ArrowLeft className="size-4" />
              用户管理
            </Link>
          </Button>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <AlertTriangle className="size-6 text-destructive" />
            用户危险区
          </h1>
        </div>
        <Button variant="outline" onClick={loadUsers} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <UserCheck className="size-4" />}
          刷新
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <Card>
          <CardHeader>
            <CardTitle>选择测试用户</CardTitle>
            <CardDescription>危险区只处理普通用户，管理员账号需要先降级。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>注册状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="w-[96px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        <Loader2 className="mx-auto mb-2 size-5 animate-spin" />
                        加载中
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        暂无用户
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((item) => {
                      const disabled = item.role !== "user" || item.id === user?.id
                      return (
                        <TableRow
                          key={item.id}
                          className={cn(selectedId === item.id && "bg-muted/60")}
                        >
                          <TableCell>
                            <div className="font-medium">{item.nickname || item.username}</div>
                            <div className="text-xs text-muted-foreground">{item.username}</div>
                          </TableCell>
                          <TableCell>
                            <span className={item.can_use ? "text-emerald-600" : "text-destructive"}>
                              {item.can_use ? "正常" : "已封禁"}
                            </span>
                          </TableCell>
                          <TableCell>{item.is_activate ? "已注册" : "未激活"}</TableCell>
                          <TableCell>{formatTime(item.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant={selectedId === item.id ? "secondary" : "outline"}
                              size="sm"
                              disabled={disabled}
                              onClick={() => selectUser(item)}
                            >
                              选择
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="size-5" />
              危险操作
            </CardTitle>
            <CardDescription>删除会真正移除用户记录，且会写入后台审计日志。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 rounded-md border p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <KeyRound className="size-4 text-primary" />
                预置测试用户
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={newUsername}
                  onChange={(event) => setNewUsername(event.target.value)}
                  placeholder="测试用户名"
                  disabled={creating}
                />
                <Button
                  variant="outline"
                  onClick={createTestUser}
                  loading={creating}
                  disabled={!newUsername.trim() || creating}
                >
                  <KeyRound className="size-4" />
                  生成
                </Button>
              </div>
            </div>

            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              {selectedUser ? (
                <div className="space-y-1">
                  <div className="font-medium">{selectedUser.nickname || selectedUser.username}</div>
                  <div className="text-muted-foreground">{selectedUser.username}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedUser.is_activate ? "已注册" : "未激活"} · {selectedUser.can_use ? "正常" : "已封禁"}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">请选择一个普通用户</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmUsername">确认用户名</Label>
              <Input
                id="confirmUsername"
                value={confirmUsername}
                onChange={(event) => setConfirmUsername(event.target.value)}
                placeholder={selectedUser?.username ?? "完整用户名"}
                disabled={!selectedUser}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dangerReason">操作原因</Label>
              <Textarea
                id="dangerReason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="例如：清理本轮注册流程测试账号"
                disabled={!selectedUser}
              />
            </div>

            {lastCode ? (
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-4" />
                  新激活码
                </div>
                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 rounded bg-background px-3 py-2 text-sm">{lastCode}</code>
                  <Button variant="outline" size="icon" onClick={copyCode} aria-label="复制激活码">
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="grid gap-3">
              <Button
                variant="outline"
                disabled={!canOperate || Boolean(selectedUser?.is_activate) || operating !== null}
                loading={operating === "code"}
                onClick={() => runOperation("code")}
              >
                <KeyRound className="size-4" />
                重新生成激活码
              </Button>
              <Button
                variant="outline"
                disabled={!canOperate || operating !== null}
                loading={operating === "reset"}
                onClick={() => runOperation("reset")}
              >
                <RotateCcw className="size-4" />
                重置为未激活测试账号
              </Button>
              <Button
                variant="destructive"
                disabled={!canOperate || !reason.trim() || operating !== null}
                loading={operating === "delete"}
                onClick={() => runOperation("delete")}
              >
                <Trash2 className="size-4" />
                永久删除测试用户
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
