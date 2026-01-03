"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Send } from "lucide-react"
import { useUser } from "@/context/user"
import { getFeedbackAPI, getReplyAPI, addReplyAPI } from "@/api"
import { useNotification } from "@/context/notification"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

export default function ReadFeedbackPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const uuid = searchParams.get("uuid")
  const { notificationError,notificationSuccess } = useNotification()

  const [feedback, setFeedback] = useState<any>(null)
  const [reply, setReply] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useUser()

  // Fetch feedback data
  useEffect(() => {
    if (!uuid) {
      notificationError("查询失败","No feedback UUID provided")
      setIsLoading(false)
      return
    }

    const fetchFeedback = async () => {
      try {
        setIsLoading(true)
        const res: any = await getFeedbackAPI(uuid)
        if (res.code === 0) {
          setFeedback(res.data)
          fetchReply(uuid)
        } else {
          notificationError("查询失败",res.message || "Failed to fetch feedback")
        }
      } catch (err) {
        notificationError("查询失败",String(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [uuid])

  // Fetch reply data
  const fetchReply = async (feedbackUuid: string) => {
    try {
      const res: any = await getReplyAPI(feedbackUuid)
      if (res.code === 0) {
        setReply(res.data)
      } else if (res.code !== 4004) {
        notificationError("查询失败",res.message || "Failed to fetch reply")
      }
    } catch (err) {
      notificationError("查询失败",String(err))
    }
  }

  // Reply Form Schema
  const replySchema = z.object({
    content: z.string().min(1, t("feedback.validation.contentRequired")).max(1000, t("feedback.validation.contentLength")),
  })

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: "",
    },
  })

  // Handle reply submission
  async function onSubmit(values: z.infer<typeof replySchema>) {
    if (!uuid || !feedback) return

    setIsSubmitting(true)
    try {
      const res: any = await addReplyAPI({
        feedbackId: feedback.id,
        content: values.content,
      })
      if (res.code === 0) {
        // Refresh reply data
        await fetchReply(uuid)
        form.reset()
      } else {
        notificationError("提交失败",res.message || "Failed to submit reply")
      }
    } catch (error) {
      notificationError("提交失败",String(error))
    } finally {
      setIsSubmitting(false)
    }
  }

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


  if (!feedback) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4 min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>{t("feedback.notFound")}</AlertDescription>
        </Alert>
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
        <Card className="border-none shadow-lg bg-background/60 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              查看反馈
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Feedback Content */}
            <div className="space-y-8">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{feedback.title}</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {feedback.category}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{feedback.content}</p>
                <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">{t("feedback.name")}: </span>
                    {feedback.name}
                  </div>
                  {feedback.contact && (
                    <div>
                      <span className="font-medium">{t("feedback.contact")}: </span>
                      {feedback.contact}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">提交于: </span>
                    {formatDate(feedback.createdAt)}
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">{t("feedback.replyTitle")}</h3>
                {reply ? (
                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{reply.content}</p>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <span className="font-medium">回复于: </span>
                      {formatDate(reply.createdAt)}
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>该建议暂未回复</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Add Reply Form (only for admin) */}
              {user?.role === "admin" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">添加回复</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>回复内容</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="请输入回复内容"
                                className="min-h-[150px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            提交中
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            提交回复
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}