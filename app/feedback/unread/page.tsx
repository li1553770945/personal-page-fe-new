"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "motion/react"
import { Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { notReadFeedbackAPI } from "@/api"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"

export default function UnreadFeedbackPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { notificationError } = useNotification()
  const { user } = useUser()
  
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      notificationError("权限不足", "只有管理员可以查看未读反馈")
      router.push("/feedback")
    }
  }, [user, router, notificationError])
  
  // Fetch unread feedbacks
  useEffect(() => {
    if (!user || user.role !== "admin") return
    
    const fetchUnreadFeedbacks = async () => {
      try {
        setIsLoading(true)
        const res: any = await notReadFeedbackAPI()
        if (res.code === 0) {
          setFeedbacks(res.data)
        } else {
          notificationError("获取失败", res.message || "获取未读反馈失败")
        }
      } catch (error) {
        notificationError("获取失败", String(error))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUnreadFeedbacks()
  }, [user, notificationError])
  
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4 min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href="/feedback">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">未读反馈列表</h1>
        </div>
        
        <Card className="border-none shadow-lg bg-background/60 backdrop-blur-sm">
          <CardContent className="p-6">
            {feedbacks.length === 0 ? (
              <Alert>
                <AlertDescription>暂无未读反馈</AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableCaption>未读反馈列表</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>提交人</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{feedback.title}</TableCell>
                      <TableCell>{feedback.name}</TableCell>
                      <TableCell>{formatDate(feedback.createdAt)}</TableCell>
                      <TableCell>
                        <Link href={`/feedback/read-feedback?uuid=${feedback.uuid}`}>
                          <Button variant="default" size="sm">
                            查看详情
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}