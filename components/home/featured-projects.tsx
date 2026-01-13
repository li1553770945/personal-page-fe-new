"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "planning"
  progress?: number
  lastUpdate: string
  tags: string[]
  link?: string
}

// 示例数据 - 后续可以从 API 获取
const projects: Project[] = [
  {
    id: "1",
    title: "个人主页重构",
    description: "使用 Next.js 14 和 shadcn/ui 重构个人主页，添加实时项目展示和博客功能",
    status: "active",
    progress: 75,
    lastUpdate: "2026-01-13",
    tags: ["Next.js", "React", "TypeScript"],
    link: "https://github.com/yourusername/personal-page"
  },
  {
    id: "2",
    title: "AI 聊天助手",
    description: "集成 Live2D 虚拟角色的智能对话系统，支持多轮对话和上下文理解",
    status: "active",
    progress: 60,
    lastUpdate: "2026-01-12",
    tags: ["AI", "WebSocket", "Live2D"],
  },
]

export function FeaturedProjects() {
  const getStatusBadge = (status: Project["status"]) => {
    const config = {
      active: { label: "🔥 进行中", variant: "default" as const },
      completed: { label: "✨ 已完成", variant: "secondary" as const },
      planning: { label: "📋 计划中", variant: "outline" as const },
    }
    return config[status]
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">正在做什么</h2>
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          查看全部 →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => {
          const statusBadge = getStatusBadge(project.status)
          return (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
              </div>
              
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {project.description}
              </p>
              
              {project.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>进度</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 bg-secondary rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {project.lastUpdate}
                </span>
              </div>
              
              {project.link && (
                <Link 
                  href={project.link}
                  target="_blank"
                  className="mt-4 inline-flex items-center text-sm text-primary hover:underline"
                >
                  查看项目 →
                </Link>
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}
