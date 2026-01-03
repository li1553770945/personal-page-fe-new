"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useUser } from "@/context/user"
import { useNotification } from "@/context/notification"
import { uploadFileAPI, downloadFileAPI, fileInfoAPI, deleteFileAPI } from "@/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Download, Trash2, File as FileIcon, Copy, Check, Loader2, Link as LinkIcon, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { error } from "console"

function FileManagementContent() {
  const { user } = useUser()
  const { notificationSuccess, notificationError, notificationInfo } = useNotification()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadKey, setUploadKey] = useState("")
  const [maxDownload, setMaxDownload] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Download State
  const [downloadKey, setDownloadKey] = useState("")
  const [isFromShare, setIsFromShare] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Delete State
  const [deleteKey, setDeleteKey] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<{ name: string; key: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Check for auto-download key
  useEffect(() => {
    const key = searchParams.get("downloadKey")
    if (key) {
      setDownloadKey(key)
      setIsFromShare(true)
      notificationInfo(t("files.notifications.shareDetected"), t("files.notifications.shareDetectedDesc"))
      
      // Scroll to download section
      const downloadSection = document.getElementById("download-section")
      if (downloadSection) {
        downloadSection.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [searchParams, notificationInfo, t])

  // File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
      setShareLink("") // Clear previous share link
    }
  }

  // Upload Logic
  const handleUpload = async () => {
    if (!uploadFile) {
      notificationError(t("files.notifications.noFile"), t("files.notifications.noFileDesc"))
      return
    }

    setUploading(true)
    try {
      // 1. Get signed URL
      const res: any = await uploadFileAPI({
        name: uploadFile.name,
        key: uploadKey || undefined, // Send undefined if empty to let server generate
        maxDownload: maxDownload
      })

      if (res.code !== 0) {
        throw new Error(res.message)
      }

      const { signedUrl, key } = res.data

      // 2. Upload to signed URL
      await axios.put(signedUrl, uploadFile, {
        headers: {
          'Content-Type': 'application/octet-stream',
        }
      })

      notificationSuccess(t("files.notifications.uploadSuccess"), t("files.notifications.uploadSuccessDesc", { key }))
      const link = `${window.location.origin}/files?downloadKey=${key}`
      setShareLink(link)
      setUploadFile(null)
      setUploadKey("")
      setMaxDownload(0)
      if (fileInputRef.current) fileInputRef.current.value = ""

    } catch (err: any) {
      notificationError(t("files.notifications.uploadFailed"), err.message || t("files.notifications.uploadFailedDesc"))
    } finally {
      setUploading(false)
    }
  }

  // Copy Link
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      notificationSuccess(t("files.notifications.copySuccess"), t("files.notifications.copySuccessDesc"))
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      notificationError(t("files.notifications.copyFailed"), t("files.notifications.copyFailedDesc  "))
    }
  }

  // Download Logic
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
      
      // Trigger download
      const link = document.createElement('a')
      link.href = signedUrl
      link.download = '' // Browser will handle filename from Content-Disposition
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      if (isFromShare) {
        setIsFromShare(false) // Reset highlight
      }
      notificationSuccess(t("files.notifications.downloadStarted"), t("files.notifications.downloadStartedDesc"))

    } catch (err: any) {
      notificationError(t("files.notifications.downloadFailed"), err.message || t("files.notifications.downloadFailedDesc"))
    } finally {
      setDownloading(false)
    }
  }

  // Delete Logic - Check File Info
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

  // Confirm Delete
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

    } catch (err: any) {
      error(t("files.notifications.deleteFailed"), err.message || t("files.notifications.deleteFailedDesc"))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("files.title")}</h1>
        <p className="text-muted-foreground">{t("files.description")}</p>
      </div>

      {/* Upload Section - Only for logged in users */}
      {user && (
        <Card className="border-primary/10 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              {t("files.upload.title")}
            </CardTitle>
            <CardDescription>{t("files.upload.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* File Drop/Select Area */}
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:bg-muted/50 cursor-pointer",
                uploadFile ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <div className="flex flex-col items-center gap-2">
                {uploadFile ? (
                  <>
                    <FileIcon className="w-10 h-10 text-primary animate-bounce" />
                    <p className="font-medium text-foreground">{uploadFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={(e) => {
                      e.stopPropagation()
                      setUploadFile(null)
                      if(fileInputRef.current) fileInputRef.current.value = ""
                    }}>{t("files.upload.dropzone.remove")}</Button>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <p className="font-medium text-foreground">{t("files.upload.dropzone.default")}</p>
                    <p className="text-sm text-muted-foreground">{t("files.upload.dropzone.limit")}</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-xs text-muted-foreground text-right">{t("files.upload.unlimited")}</p>
              </div>
            </div>

            {/* Share Link Display */}
            <AnimatePresence>
              {shareLink && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 bg-muted/50 p-4 rounded-lg border border-primary/20"
                >
                  <Label className="text-primary font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> {t("files.upload.shareLink")}
                  </Label>
                  <div className="flex gap-2">
                    <Input readOnly value={shareLink} className="bg-background" />
                    <Button onClick={copyToClipboard} variant="secondary">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("files.upload.shareLinkDesc")}</p>
                </motion.div>
              )}
            </AnimatePresence>

          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleUpload} 
              disabled={uploading || !uploadFile}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("files.upload.uploading")}
                </>
              ) : (
                t("files.upload.button")
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Download Section */}
      <Card 
        id="download-section"
        className={cn(
          "transition-all duration-500",
          isFromShare ? "ring-2 ring-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] border-primary" : "shadow-md"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              {t("files.download.title")}
            </div>
            {isFromShare && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium animate-pulse">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("files.download.preparing")}
                </>
              ) : (
                isFromShare ? t("files.download.buttonShared") : t("files.download.button")
              )}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Section - Only for logged in users */}
      {user && (
        <Card className="border-red-100 dark:border-red-900/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="w-5 h-5" />
              {t("files.delete.title")}
            </CardTitle>
            <CardDescription>{t("files.delete.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              {t("files.delete.confirmTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("files.delete.confirmContent", { name: fileToDelete?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{t("files.delete.cancel")}</Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
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
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <FileManagementContent />
    </Suspense>
  )
}
