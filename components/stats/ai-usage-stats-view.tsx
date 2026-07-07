"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { ElementType } from "react"
import {
  Activity,
  BarChart3,
  Bot,
  CalendarDays,
  CircleDollarSign,
  Loader2,
  Server,
  ShieldAlert,
} from "lucide-react"

import { adminAIUsageStatsAPI, myAIUsageStatsAPI, type AIUsageStatsParams } from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useNotification } from "@/store/notification"
import { useUser } from "@/store/user"
import type { AIUsageStatsBreakdown, AIUsageStatsData, AIUsageStatsDay, AIUsageStatsTotals } from "@/types/api"

type MetricMode = "tokens" | "cost"

type AIUsageStatsViewProps = {
  admin?: boolean
}

const allValue = "__all__"

const getLocalDateInput = (offsetDays = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getErrorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

const metricValue = (item: Pick<AIUsageStatsTotals, "total_tokens" | "total_price">, metric: MetricMode) =>
  metric === "tokens" ? item.total_tokens : item.total_price

const formatInteger = (value: number) => new Intl.NumberFormat("zh-CN").format(value)

const formatMoney = (value: number, currency = "USD") => {
  if (!Number.isFinite(value)) return "-"
  const normalized = currency || "USD"
  if (normalized === "MIXED") {
    return `${value.toFixed(4)} MIXED`
  }
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: normalized,
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 6,
  }).format(value)
}

const formatMetric = (item: Pick<AIUsageStatsTotals, "total_tokens" | "total_price" | "currency">, metric: MetricMode) =>
  metric === "tokens" ? formatInteger(item.total_tokens) : formatMoney(item.total_price, item.currency)

export function AIUsageStatsView({ admin = false }: AIUsageStatsViewProps) {
  const { user, refresh } = useUser()
  const { notificationError } = useNotification()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AIUsageStatsData | null>(null)
  const [metric, setMetric] = useState<MetricMode>("tokens")
  const [from, setFrom] = useState(() => getLocalDateInput(-29))
  const [to, setTo] = useState(() => getLocalDateInput())
  const [model, setModel] = useState(allValue)
  const [channel, setChannel] = useState(allValue)

  const canView = admin ? user?.role === "super_admin" : Boolean(user)

  const loadStats = useCallback(async () => {
    if (!canView) return
    setLoading(true)
    try {
      const params: AIUsageStatsParams = {
        from,
        to,
        model: model === allValue ? undefined : model,
        channel: admin && channel !== allValue ? channel : undefined,
      }
      const res = admin ? await adminAIUsageStatsAPI(params) : await myAIUsageStatsAPI(params)
      if (res.code !== 0) {
        throw new Error(res.message)
      }
      setData(res.data)
    } catch (err: unknown) {
      notificationError("加载失败", getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [admin, canView, channel, from, model, notificationError, to])

  useEffect(() => {
    refresh().then(() => setReady(true))
  }, [refresh])

  useEffect(() => {
    if (ready && canView) {
      void loadStats()
    }
  }, [ready, canView, loadStats])

  const peakDay = useMemo(() => {
    if (!data?.days.length) return null
    return data.days.reduce((best, item) => (metricValue(item, metric) > metricValue(best, metric) ? item : best), data.days[0])
  }, [data, metric])

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!canView) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              无权访问
            </CardTitle>
            <CardDescription>{admin ? "只有超级管理员可以查看管理端 AI 用量。" : "请登录后查看你的 AI 用量。"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <BarChart3 className="size-6 text-primary" />
            {admin ? "AI 用量管理" : "我的 AI 用量"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.from} 至 ${data.to}` : "加载统计数据"}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="usageFrom">开始</Label>
            <Input id="usageFrom" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="h-9 w-[150px]" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="usageTo">结束</Label>
            <Input id="usageTo" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="h-9 w-[150px]" />
          </div>
          <div className="grid gap-1.5">
            <Label>模型</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allValue}>全部模型</SelectItem>
                {(data?.models ?? []).map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {admin ? (
            <div className="grid gap-1.5">
              <Label>渠道</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={allValue}>全部渠道</SelectItem>
                  {(data?.channels ?? []).map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <Button variant="outline" onClick={loadStats} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Activity className="size-4" />}
            刷新
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Tabs value={metric} onValueChange={(value) => setMetric(value as MetricMode)}>
          <TabsList>
            <TabsTrigger value="tokens">Token</TabsTrigger>
            <TabsTrigger value="cost">费用</TabsTrigger>
          </TabsList>
        </Tabs>
        {peakDay ? (
          <div className="text-sm text-muted-foreground">
            峰值日 {peakDay.date} · {formatMetric(peakDay, metric)}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="请求数" value={formatInteger(data?.totals.request_count ?? 0)} icon={Activity} sub={`成功 ${formatInteger(data?.totals.success_count ?? 0)} / 失败 ${formatInteger(data?.totals.failed_count ?? 0)}`} />
        <StatCard title="Token" value={formatInteger(data?.totals.total_tokens ?? 0)} icon={Bot} sub={`输入 ${formatInteger(data?.totals.prompt_tokens ?? 0)} / 输出 ${formatInteger(data?.totals.completion_tokens ?? 0)}`} />
        <StatCard title="费用" value={formatMoney(data?.totals.total_price ?? 0, data?.totals.currency)} icon={CircleDollarSign} sub={data?.totals.currency ?? "USD"} />
        <StatCard title={admin ? "渠道数" : "模型数"} value={formatInteger(admin ? (data?.channels?.length ?? 0) : (data?.models.length ?? 0))} icon={admin ? Server : CalendarDays} sub={admin ? `${formatInteger(data?.models.length ?? 0)} 个模型` : `${formatInteger(data?.days.length ?? 0)} 天`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>每日趋势</CardTitle>
          <CardDescription>按天聚合请求、Token 和费用。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="grid gap-3">
              <div className="text-sm font-medium">请求数</div>
              <DailyRequestBars days={data?.days ?? []} />
            </div>
            <div className="grid gap-3">
              <div className="text-sm font-medium">{metric === "tokens" ? "Token" : "费用"}</div>
              <DailyBars days={data?.days ?? []} metric={metric} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={cn("grid gap-6", admin ? "xl:grid-cols-3" : "xl:grid-cols-2")}>
        <Card>
          <CardHeader>
            <CardTitle>模型用量</CardTitle>
            <CardDescription>按模型汇总。</CardDescription>
          </CardHeader>
          <CardContent>
            <BreakdownBars items={data?.model_breakdown ?? []} metric={metric} label={(item) => item.model || "unknown"} />
          </CardContent>
        </Card>
        {admin ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>渠道用量</CardTitle>
                <CardDescription>按渠道汇总。</CardDescription>
              </CardHeader>
              <CardContent>
                <BreakdownBars items={data?.channel_breakdown ?? []} metric={metric} label={(item) => item.channel || "unknown"} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>渠道模型组合</CardTitle>
                <CardDescription>按渠道和模型汇总。</CardDescription>
              </CardHeader>
              <CardContent>
                <BreakdownBars items={data?.channel_model_breakdown ?? []} metric={metric} label={(item) => `${item.channel || "unknown"} / ${item.model || "unknown"}`} />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>请求状态</CardTitle>
              <CardDescription>成功和失败请求占比。</CardDescription>
            </CardHeader>
            <CardContent>
              <StatusBars totals={data?.totals} />
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>每日明细</CardTitle>
          <CardDescription>表格数据与趋势图使用同一统计口径。</CardDescription>
        </CardHeader>
        <CardContent>
          <DailyTable days={data?.days ?? []} />
        </CardContent>
      </Card>

      {admin ? (
        <Card>
          <CardHeader>
            <CardTitle>渠道模型明细</CardTitle>
            <CardDescription>管理端专用。</CardDescription>
          </CardHeader>
          <CardContent>
            <BreakdownTable items={data?.channel_model_breakdown ?? []} showChannel />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function StatCard({ title, value, icon: Icon, sub }: { title: string; value: string; icon: ElementType; sub: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-2xl">{value}</CardTitle>
        </div>
        <Icon className="size-5 text-primary" />
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{sub}</CardContent>
    </Card>
  )
}

function DailyBars({ days, metric }: { days: AIUsageStatsDay[]; metric: MetricMode }) {
  const max = Math.max(...days.map((day) => metricValue(day, metric)), 0)
  if (days.length === 0) {
    return <EmptyState />
  }
  return (
    <div className="grid gap-3">
      <div className="grid min-h-[220px] grid-flow-col items-end gap-2 overflow-x-auto pb-2">
        {days.map((day) => {
          const value = metricValue(day, metric)
          const height = max > 0 ? Math.max((value / max) * 100, value > 0 ? 4 : 1) : 1
          return (
            <div key={day.date} className="flex min-w-10 flex-col items-center gap-2">
              <div className="flex h-44 w-full items-end rounded-sm bg-muted/50 px-1">
                <div
                  className="w-full rounded-sm bg-primary/80 transition-all"
                  style={{ height: `${height}%` }}
                  title={`${day.date} ${formatMetric(day, metric)}`}
                />
              </div>
              <div className="w-12 truncate text-center text-[11px] text-muted-foreground">{day.date.slice(5)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DailyRequestBars({ days }: { days: AIUsageStatsDay[] }) {
  const max = Math.max(...days.map((day) => day.request_count), 0)
  if (days.length === 0) {
    return <EmptyState />
  }
  return (
    <div className="grid min-h-[220px] grid-flow-col items-end gap-2 overflow-x-auto pb-2">
      {days.map((day) => {
        const value = day.request_count
        const height = max > 0 ? Math.max((value / max) * 100, value > 0 ? 4 : 1) : 1
        return (
          <div key={day.date} className="flex min-w-10 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end rounded-sm bg-muted/50 px-1">
              <div
                className="w-full rounded-sm bg-emerald-500/80 transition-all"
                style={{ height: `${height}%` }}
                title={`${day.date} ${formatInteger(value)} 次`}
              />
            </div>
            <div className="w-12 truncate text-center text-[11px] text-muted-foreground">{day.date.slice(5)}</div>
          </div>
        )
      })}
    </div>
  )
}

function BreakdownBars({ items, metric, label }: { items: AIUsageStatsBreakdown[]; metric: MetricMode; label: (item: AIUsageStatsBreakdown) => string }) {
  const visible = items.slice(0, 10)
  const max = Math.max(...visible.map((item) => metricValue(item, metric)), 0)
  if (visible.length === 0) {
    return <EmptyState />
  }
  return (
    <div className="grid gap-3">
      {visible.map((item) => {
        const value = metricValue(item, metric)
        const width = max > 0 ? Math.max((value / max) * 100, value > 0 ? 3 : 1) : 1
        return (
          <div key={`${item.channel || ""}-${item.model || ""}`} className="grid gap-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">{label(item)}</span>
              <span className="shrink-0 text-muted-foreground">{formatMetric(item, metric)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary/80" style={{ width: `${width}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatusBars({ totals }: { totals?: AIUsageStatsTotals }) {
  const success = totals?.success_count ?? 0
  const failed = totals?.failed_count ?? 0
  const total = Math.max(success + failed, 1)
  return (
    <div className="grid gap-4">
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-emerald-500" style={{ width: `${(success / total) * 100}%` }} />
      </div>
      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">成功</span>
          <span>{formatInteger(success)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">失败</span>
          <span>{formatInteger(failed)}</span>
        </div>
      </div>
    </div>
  )
}

function DailyTable({ days }: { days: AIUsageStatsDay[] }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日期</TableHead>
            <TableHead>请求</TableHead>
            <TableHead>成功</TableHead>
            <TableHead>失败</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>输入</TableHead>
            <TableHead>输出</TableHead>
            <TableHead>费用</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">暂无数据</TableCell>
            </TableRow>
          ) : (
            days.map((day) => (
              <TableRow key={day.date}>
                <TableCell className="font-medium">{day.date}</TableCell>
                <TableCell>{formatInteger(day.request_count)}</TableCell>
                <TableCell>{formatInteger(day.success_count)}</TableCell>
                <TableCell>{formatInteger(day.failed_count)}</TableCell>
                <TableCell>{formatInteger(day.total_tokens)}</TableCell>
                <TableCell>{formatInteger(day.prompt_tokens)}</TableCell>
                <TableCell>{formatInteger(day.completion_tokens)}</TableCell>
                <TableCell>{formatMoney(day.total_price, day.currency)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function BreakdownTable({ items, showChannel = false }: { items: AIUsageStatsBreakdown[]; showChannel?: boolean }) {
  const colSpan = showChannel ? 8 : 7
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showChannel ? <TableHead>渠道</TableHead> : null}
            <TableHead>模型</TableHead>
            <TableHead>请求</TableHead>
            <TableHead>成功</TableHead>
            <TableHead>失败</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>输入/输出</TableHead>
            <TableHead>费用</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">暂无数据</TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={`${item.channel || ""}-${item.model || ""}`}>
                {showChannel ? <TableCell>{item.channel || "unknown"}</TableCell> : null}
                <TableCell className="font-medium">{item.model || "unknown"}</TableCell>
                <TableCell>{formatInteger(item.request_count)}</TableCell>
                <TableCell>{formatInteger(item.success_count)}</TableCell>
                <TableCell>{formatInteger(item.failed_count)}</TableCell>
                <TableCell>{formatInteger(item.total_tokens)}</TableCell>
                <TableCell>{formatInteger(item.prompt_tokens)} / {formatInteger(item.completion_tokens)}</TableCell>
                <TableCell>{formatMoney(item.total_price, item.currency)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function EmptyState() {
  return <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">暂无数据</div>
}
