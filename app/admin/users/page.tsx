"use client"

import { useEffect, useState } from "react"
import { Loader2, ShieldAlert, Users } from "lucide-react"

import { adminUsersAPI, updateUserRoleAPI, updateUserStatusAPI } from "@/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { AdminUserData, UserRole } from "@/types/api"

const roleLabels: Record<UserRole, string> = {
  super_admin: "超级管理员",
  admin: "普通管理员",
  user: "普通用户",
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

export default function AdminUsersPage() {
  const { user, refresh } = useUser()
  const { notificationError, notificationSuccess } = useNotification()
  const [ready, setReady] = useState(false)
  const [users, setUsers] = useState<AdminUserData[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await adminUsersAPI()
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      setUsers(res.data ?? [])
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
        void loadUsers()
      }
    })
  }, [])

  const replaceUser = (updated: AdminUserData) => {
    setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
  }

  const handleRoleChange = async (target: AdminUserData, role: UserRole) => {
    if (target.role === role) return
    setUpdatingId(target.id)
    try {
      const res: any = await updateUserRoleAPI(target.id, role)
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      replaceUser(res.data)
      notificationSuccess("角色已更新", `${target.username} -> ${roleLabels[role]}`)
    } catch (err: any) {
      notificationError("更新失败", err?.message ?? String(err))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleStatusChange = async (target: AdminUserData, canUse: boolean) => {
    setUpdatingId(target.id)
    try {
      const res: any = await updateUserStatusAPI(target.id, canUse)
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      replaceUser(res.data)
      notificationSuccess(canUse ? "已解封" : "已封禁", target.username)
    } catch (err: any) {
      notificationError("更新失败", err?.message ?? String(err))
    } finally {
      setUpdatingId(null)
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
            <CardDescription>只有超级管理员可以查看用户管理。</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            用户管理
          </CardTitle>
          <CardDescription>查看所有用户，调整角色，并封禁或解封账号。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>注册状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>更新时间</TableHead>
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
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      暂无用户
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.nickname || item.username}</div>
                        <div className="text-xs text-muted-foreground">{item.username}</div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.role}
                          onValueChange={(value) => handleRoleChange(item, value as UserRole)}
                          disabled={updatingId === item.id}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super_admin">超级管理员</SelectItem>
                            <SelectItem value="admin">普通管理员</SelectItem>
                            <SelectItem value="user">普通用户</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={item.can_use}
                            onCheckedChange={(checked) => handleStatusChange(item, checked)}
                            disabled={updatingId === item.id}
                          />
                          <span className={item.can_use ? "text-emerald-600" : "text-destructive"}>
                            {item.can_use ? "正常" : "已封禁"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{item.is_activate ? "已注册" : "未激活"}</TableCell>
                      <TableCell>{formatTime(item.created_at)}</TableCell>
                      <TableCell>{formatTime(item.updated_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
