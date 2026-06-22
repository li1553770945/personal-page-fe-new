"use client"

import { Copy, Loader2, RefreshCw, Trash2 } from "lucide-react"

import type { ManagedFileData } from "@/types/api"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type FileListTableProps = {
  files: ManagedFileData[]
  loading?: boolean
  deletingId?: number | null
  showOwner?: boolean
  onRefresh?: () => void
  onDelete?: (file: ManagedFileData) => void
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

const formatLimit = (file: ManagedFileData) => {
  if (file.kind === "local") {
    return file.count < 0 ? "无限" : String(file.count)
  }
  if (!file.max_download) {
    return "无限"
  }
  return `${file.download_count}/${file.max_download}`
}

export function FileListTable({
  files,
  loading,
  deletingId,
  showOwner,
  onRefresh,
  onDelete,
}: FileListTableProps) {
  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">共 {files.length} 个文件</div>
        {onRefresh ? (
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
            刷新
          </Button>
        ) : null}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>文件名</TableHead>
              <TableHead>Key</TableHead>
              {showOwner ? <TableHead>上传用户</TableHead> : null}
              <TableHead>类型</TableHead>
              <TableHead>下载限制</TableHead>
              <TableHead>上传时间</TableHead>
              <TableHead className="w-[110px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={showOwner ? 7 : 6} className="h-24 text-center text-muted-foreground">
                  <Loader2 className="mx-auto mb-2 size-5 animate-spin" />
                  加载中
                </TableCell>
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showOwner ? 7 : 6} className="h-24 text-center text-muted-foreground">
                  暂无文件
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="max-w-[220px] truncate font-medium">{file.name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex max-w-[180px] items-center gap-2">
                      <span className="truncate font-mono text-xs">{file.key || "-"}</span>
                      {file.key ? (
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => copyKey(file.key)}>
                          <Copy className="size-3.5" />
                          <span className="sr-only">复制 Key</span>
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                  {showOwner ? (
                    <TableCell>
                      <div className="max-w-[160px] truncate">
                        {file.nickname || file.username || `用户 ${file.user_id || "-"}`}
                      </div>
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <span className="rounded-md border px-2 py-1 text-xs">
                      {file.kind === "object" ? "COS" : "本地"}
                    </span>
                  </TableCell>
                  <TableCell>{formatLimit(file)}</TableCell>
                  <TableCell>{formatTime(file.created_at)}</TableCell>
                  <TableCell className="text-right">
                    {onDelete ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(file)}
                        disabled={deletingId === file.id}
                      >
                        {deletingId === file.id ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 size-4" />
                        )}
                        删除
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
