"use client"

import { useEffect, useState } from "react"
import { Files, Loader2, ShieldAlert } from "lucide-react"

import { adminFilesAPI, deleteFileByIdAPI } from "@/api"
import { FileListTable } from "@/components/files/file-list-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { ManagedFileData } from "@/types/api"

export default function AdminFilesPage() {
  const { user, refresh } = useUser()
  const { notificationError, notificationSuccess } = useNotification()
  const [ready, setReady] = useState(false)
  const [files, setFiles] = useState<ManagedFileData[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadFiles = async () => {
    setLoading(true)
    try {
      const res = await adminFilesAPI()
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      setFiles(res.data ?? [])
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
        void loadFiles()
      }
    })
  }, [])

  const handleDelete = async (file: ManagedFileData) => {
    setDeletingId(file.id)
    try {
      const res: any = await deleteFileByIdAPI(file.id)
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      notificationSuccess("删除成功", file.name)
      await loadFiles()
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
            <CardDescription>只有超级管理员可以查看全站文件管理。</CardDescription>
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
            <Files className="size-5 text-primary" />
            总文件管理
          </CardTitle>
          <CardDescription>查看所有用户上传且未删除的文件。</CardDescription>
        </CardHeader>
        <CardContent>
          <FileListTable
            files={files}
            loading={loading}
            deletingId={deletingId}
            showOwner
            onRefresh={loadFiles}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}
