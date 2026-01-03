"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Star, Send, Search, Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { allFeedbackCategoriesAPI, saveFeedbackAPI, getFeedbackAPI } from "@/api"
import { cn } from "@/lib/utils"
import { ApiResponse, FeedbackCategory } from "@/types/api"
import { useNotification } from "@/context/notification"

export default function FeedbackPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [categories, setCategories] = useState<FeedbackCategory[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submittedUuid, setSubmittedUuid] = useState("")
const { notificationSuccess, notificationError } = useNotification()

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: ApiResponse<FeedbackCategory[]> = await allFeedbackCategoriesAPI()
        if (res.code === 0) {
          setCategories(res.data)
        }
      } catch (error) {
        notificationError("获取消息类别失败",  String(error))
      }
    }
    fetchCategories()
  }, [])

  // Feedback Form Schema
  const feedbackSchema = z.object({
    categoryId: z.optional(z.number()).refine(val => val !== undefined, {
      message: t("feedback.validation.categoryRequired"),
    }),
    title: z.string().min(1, t("feedback.validation.titleRequired")).max(100),
    content: z.string().min(10, t("feedback.validation.contentLength")).max(1000, t("feedback.validation.contentLength")),
    name: z.string().min(1, t("feedback.validation.nameRequired")).max(50),
    contact: z.string().optional(),
  })

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      categoryId: undefined,
      title: "",
      content: "",
      name: "",
      contact: "",
    },
  })

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    setIsSubmitting(true)
    try {
      const res = await saveFeedbackAPI(values)
      if (res.code === 0) {
        setSubmittedUuid(res.data.uuid)
        setDialogOpen(true)
        form.reset()
        notificationSuccess("提交成功","已经收到您的反馈")
      } else {
        notificationError("提交失败", res.msg)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reply Query Form Schema
  const querySchema = z.object({
    uuid: z.string().min(1, t("feedback.validation.uuidRequired")),
  })

  const queryForm = useForm<z.infer<typeof querySchema>>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      uuid: "",
    },
  })

  function onQuerySubmit(values: z.infer<typeof querySchema>) {
    const checkFeedback = async () => {
      try {
        const res:any = await getFeedbackAPI(values.uuid);
        if (res.code === 0) {
          router.push(`/feedback/read-feedback?uuid=${values.uuid}`);
        } else {
          notificationError("查询失败", res.message);
        }
      } catch (error) {
        notificationError("查询失败", String(error));
      }
    };
    checkFeedback();
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
                    {t("nav.consultation")}
                </CardTitle>
                <CardDescription>
                    {t("feedback.sectionTitle")}
                </CardDescription>
            </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="message" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="message">{t("feedback.title")}</TabsTrigger>
                <TabsTrigger value="reply">{t("feedback.replyTitle")}</TabsTrigger>
              </TabsList>

              <TabsContent value="message">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>{t("feedback.category")}</FormLabel>
                                <Select
                                  onValueChange={(value) => field.onChange(Number(value))}
                                  value={field.value?.toString()}
                                >
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("feedback.categoryPlaceholder")} />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500 min-h-[1.5rem]"/>
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>{t("feedback.messageTitle")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("feedback.messageTitlePlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500 min-h-[1.5rem]"/>
                                </FormItem>
                            )}
                            />
                        </div>

                        <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t("feedback.content")}</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder={t("feedback.contentPlaceholder")}
                                className="min-h-[150px] resize-none"
                                {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-xs text-right">
                                {field.value.length}/1000
                            </FormDescription>
                            <FormMessage className="text-red-500"/>
                            </FormItem>
                        )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>{t("feedback.name")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("feedback.namePlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500 min-h-[1.5rem]"/>
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>{t("feedback.contact")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("feedback.contactPlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500 min-h-[1.5rem]"/>
                                </FormItem>
                            )}
                            />
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        {t("feedback.submit")}
                                    </>
                                )}
                            </Button>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or
                                    </span>
                                </div>
                            </div>

                            <Link href="/appreciate" className="w-full">
                                <Button variant="outline" className="w-full border-green-500/50 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30">
                                    <Star className="mr-2 h-4 w-4" />
                                    {t("feedback.appreciate")}
                                </Button>
                            </Link>
                        </div>
                    </form>
                    </Form>
                </motion.div>
              </TabsContent>

              <TabsContent value="reply">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="py-8"
                >
                    <div className="max-w-md mx-auto space-y-8">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-medium">{t("feedback.querySectionTitle")}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t("feedback.queryIdDesc")}
                            </p>
                        </div>
                        
                        <Form {...queryForm}>
                        <form onSubmit={queryForm.handleSubmit(onQuerySubmit)} className="space-y-6">
                            <FormField
                            control={queryForm.control}
                            name="uuid"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t("feedback.queryId")}</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" placeholder={t("feedback.queryIdPlaceholder")} {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit" className="w-full">
                                {t("feedback.queryButton")}
                            </Button>
                        </form>
                        </Form>
                    </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                {t("feedback.successTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("feedback.successMessage")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-md break-all font-mono text-center select-all">
                {submittedUuid}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
                {t("feedback.dialogContent", { uuid: "" }).replace("{{uuid}}", "")}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>{t("feedback.confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
