"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "motion/react"
import { AlertCircle, Check, Copy, Download, File as FileIcon, Link as LinkIcon, Loader2, Trash2, Upload } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"

import { deleteFileAPI, deleteFileByIdAPI, downloadFileAPI, fileInfoAPI, myFilesAPI, uploadFileAPI } from "@/api"
import { FileListTable } from "@/components/files/file-list-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { ManagedFileData } from "@/types/api"

function FileManagementContent() {
  const shouldReduceMotion = usePrefersReducedMotion()
  const { user } = useUser()
  const { notificationSuccess, notificationError, notificationInfo } = useNotification()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadKey, setUploadKey] = useState("")
  const [maxDownload, setMaxDownload] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [downloadKey, setDownloadKey] = useState("")
  const [isFromShare, setIsFromShare] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const [deleteKey, setDeleteKey] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<{ name: string; key: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [myFiles, setMyFiles] = useState<ManagedFileData[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [deletingFileId, setDeletingFileId] = useState<number | null>(null)

  const loadMyFiles = async () => {
    if (!user) {
      setMyFiles([])
      return
    }
    setListLoading(true)
    try {
      const res = await myFilesAPI()
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      setMyFiles(res.data ?? [])
    } catch (err: any) {
      notificationError("加载文件失败", err?.message ?? String(err))
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    const key = searchParams.get("downloadKey")
    if (key) {
      setDownloadKey(key)
      setIsFromShare(true)
      notificationInfo(t("files.notifications.shareDetected"), t("files.notifications.shareDetectedDesc"))

      const downloadSection = document.getElementById("download-section")
      if (downloadSection) {
        downloadSection.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "center",
        })
      }
    }
  }, [searchParams, notificationInfo, t])

  useEffect(() => {
    void loadMyFiles()
  }, [user?.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
      setShareLink("")
    }
  }

  const handleUpload = async () => {
    if (!uploadFile) {
      notificationError(t("files.notifications.noFile"), t("files.notifications.noFileDesc"))
      return
    }

    setUploading(true)
    try {
      const res: any = await uploadFileAPI({
        name: uploadFile.name,
        key: uploadKey || undefined,
        maxDownload,
      })

      if (res.code !== 0) {
        throw new Error(res.message)
      }

      const { signedUrl, key } = res.data

      await axios.put(signedUrl, uploadFile, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      })

      notificationSuccess(t("files.notifications.uploadSuccess"), t("files.notifications.uploadSuccessDesc", { key }))
      setShareLink(`${window.location.origin}/files?downloadKey=${key}`)
      setUploadFile(null)
      setUploadKey("")
      setMaxDownload(0)
      if (fileInputRef.current) fileInputRef.current.value = ""
      await loadMyFiles()
    } catch (err: any) {
      notificationError(t("files.notifications.uploadFailed"), err.message || t("files.notifications.uploadFailedDesc"))
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      notificationSuccess(t("files.notifications.copySuccess"), t("files.notifications.copySuccessDesc"))
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      notificationError(t("files.notifications.copyFailed"), t("files.notifications.copyFailedDesc"))
    }
  }

  const handleDownload = async () => {
    if (!downloadKey) {
      notificationError(t("files.notifications.missingKey"), t("files.notifications.missingKeyDesc"))
      return
    }

    setDownloading(true)
    try {
      const res: any = await downloadFileAPI(downloadKey)
      if (res.code !== 0) {
        throw new Error(res.message)
      }

      const { signedUrl } = res.data
      const link = document.createElement("a")
      link.href = signedUrl
      link.download = ""
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      if (isFromShare) {
        setIsFromShare(false)
      }
      notificationSuccess(t("files.notifications.downloadStarted"), t("files.notifications.downloadStartedDesc"))
    } catch (err: any) {
      notificationError(t("files.notifications.downloadFailed"), err.message || t("files.notifications.downloadFailedDesc"))
    } finally {
      setDownloading(false)
    }
  }

  const handleDeleteCheck = async () => {
    if (!deleteKey) {
      notificationError(t("files.notifications.missingKey"), t("files.notifications.missingKeyDesc"))
      return
    }

    try {
      const res: any = await fileInfoAPI(deleteKey)
      if (res.code !== 0) {
        throw new Error(res.message)
      }

      setFileToDelete({ name: res.data.name, key: deleteKey })
      setDeleteDialogOpen(true)
    } catch (err: any) {
      notificationError(t("files.notifications.infoError"), err.message || t("files.notifications.infoErrorDesc"))
    }
  }

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return

    setDeleting(true)
    try {
      const res: any = await deleteFileAPI(fileToDelete.key)
      if (res.code !== 0) {
        throw new Error(res.message)
      }

      notificationSuccess(t("files.notifications.deleteSuccess"), t("files.notifications.deleteSuccessDesc", { name: fileToDelete.name }))
      setDeleteDialogOpen(false)
      setFileToDelete(null)
      setDeleteKey("")
      await loadMyFiles()
    } catch (err: any) {
      notificationError(t("files.notifications.deleteFailed"), err.message || t("files.notifications.deleteFailedDesc"))
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteListedFile = async (file: ManagedFileData) => {
    setDeletingFileId(file.id)
    try {
      const res: any = await deleteFileByIdAPI(file.id)
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      notificationSuccess(t("files.notifications.deleteSuccess"), t("files.notifications.deleteSuccessDesc", { name: file.name }))
      await loadMyFiles()
    } catch (err: any) {
      notificationError(t("files.notifications.deleteFailed"), err.message || t("files.notifications.deleteFailedDesc"))
    } finally {
      setDeletingFileId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("files.title")}</h1>
        <p className="text-muted-foreground">{t("files.description")}</p>
      </div>

      <Tabs defaultValue="transfer" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="transfer">传输</TabsTrigger>
          <TabsTrigger value="mine" disabled={!user}>
            我的文件
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transfer" className="mt-6 space-y-8">
          {user && (
            <Card className="border-primary/10 bg-card/50 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-5 text-primary" />
                  {t("files.upload.title")}
                </CardTitle>
                <CardDescription>{t("files.upload.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={cn(
                    "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:bg-muted/50",
                    uploadFile ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                  <div className="flex flex-col items-center gap-2">
                    {uploadFile ? (
                      <>
                        <FileIcon className="size-10 animate-bounce text-primary" />
                        <p className="font-medium text-foreground">{uploadFile.name}</p>
                        <p className="text-sm text-muted-foreground">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadFile(null)
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                        >
                          {t("files.upload.dropzone.remove")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Upload className="size-10 text-muted-foreground" />
                        <p className="font-medium text-foreground">{t("files.upload.dropzone.default")}</p>
                        <p className="text-sm text-muted-foreground">{t("files.upload.dropzone.limit")}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="file-key">{t("files.upload.customKey")}</Label>
                    <Input
                      id="file-key"
                      placeholder={t("files.upload.customKeyPlaceholder")}
                      value={uploadKey}
                      onChange={(e) => setUploadKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-download">{t("files.upload.maxDownloads")}</Label>
                    <Input
                      id="max-download"
                      type="number"
                      min={0}
                      max={100}
                      value={maxDownload}
                      onChange={(e) => setMaxDownload(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-right text-xs text-muted-foreground">{t("files.upload.unlimited")}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {shareLink && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                      className="space-y-2 rounded-lg border border-primary/20 bg-muted/50 p-4"
                    >
                      <Label className="flex items-center gap-2 font-semibold text-primary">
                        <LinkIcon className="size-4" />
                        {t("files.upload.shareLink")}
                      </Label>
                      <div className="flex gap-2">
                        <Input readOnly value={shareLink} className="bg-background" />
                        <Button onClick={copyToClipboard} variant="secondary">
                          {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{t("files.upload.shareLinkDesc")}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleUpload} disabled={uploading || !uploadFile}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {t("files.upload.uploading")}
                    </>
                  ) : (
                    t("files.upload.button")
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card
            id="download-section"
            className={cn(
              "transition-all duration-500",
              isFromShare ? "border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] ring-2 ring-primary" : "shadow-md"
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="size-5 text-blue-500" />
                  {t("files.download.title")}
                </div>
                {isFromShare && (
                  <span className="animate-pulse rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {t("files.download.fromShare")}
                  </span>
                )}
              </CardTitle>
              <CardDescription>{t("files.download.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="download-key">{t("files.download.keyLabel")}</Label>
                  <Input
                    id="download-key"
                    placeholder={t("files.download.keyPlaceholder")}
                    value={downloadKey}
                    onChange={(e) => setDownloadKey(e.target.value)}
                    className={cn(isFromShare && "border-primary bg-primary/5")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={cn("w-full", isFromShare && "bg-primary hover:bg-primary/90")}
                variant={isFromShare ? "default" : "secondary"}
                onClick={handleDownload}
                disabled={downloading || !downloadKey}
              >
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {t("files.download.preparing")}
                  </>
                ) : isFromShare ? (
                  t("files.download.buttonShared")
                ) : (
                  t("files.download.button")
                )}
              </Button>
            </CardFooter>
          </Card>

          {user && (
            <Card className="border-red-100 shadow-sm dark:border-red-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Trash2 className="size-5" />
                  {t("files.delete.title")}
                </CardTitle>
                <CardDescription>{t("files.delete.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="delete-key">{t("files.delete.keyLabel")}</Label>
                    <Input
                      id="delete-key"
                      placeholder={t("files.delete.keyPlaceholder")}
                      value={deleteKey}
                      onChange={(e) => setDeleteKey(e.target.value)}
                    />
                  </div>
                  <Button variant="destructive" onClick={handleDeleteCheck}>
                    {t("files.delete.button")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mine" className="mt-6">
          {user ? (
            <Card>
              <CardHeader>
                <CardTitle>我的文件</CardTitle>
                <CardDescription>当前账号上传且未删除的文件。</CardDescription>
              </CardHeader>
              <CardContent>
                <FileListTable
                  files={myFiles}
                  loading={listLoading}
                  deletingId={deletingFileId}
                  onRefresh={loadMyFiles}
                  onDelete={handleDeleteListedFile}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>我的文件</CardTitle>
                <CardDescription>登录后可以查看当前账号上传且未删除的文件。</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="size-5" />
              {t("files.delete.confirmTitle")}
            </DialogTitle>
            <DialogDescription>{t("files.delete.confirmContent", { name: fileToDelete?.name })}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t("files.delete.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? t("files.delete.deleting") : t("files.delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function FilesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <FileManagementContent />
    </Suspense>
  )
}
