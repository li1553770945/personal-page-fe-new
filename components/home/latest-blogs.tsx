"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  publishedAt: string
  readTime: string
  tags: string[]
  link: string
}

// 示例数据 - 后续可以从 API 或 CMS 获取
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Next.js 14 App Router 实践总结",
    excerpt: "深入探讨 Next.js 14 的新特性，包括 Server Components、并行路由和拦截路由的实际应用场景...",
    publishedAt: "2026-01-10",
    readTime: "8 分钟",
    tags: ["Next.js", "React", "前端"],
    link: "/blog/nextjs-14-practice"
  },
  {
    id: "2",
    title: "如何设计一个吸引人的个人主页",
    excerpt: "从用户体验出发，分享个人主页设计的思路，包括内容架构、视觉层次和交互设计...",
    publishedAt: "2026-01-08",
    readTime: "6 分钟",
    tags: ["设计", "UX", "个人品牌"],
    link: "/blog/personal-page-design"
  },
  {
    id: "3",
    title: "TypeScript 类型体操进阶技巧",
    excerpt: "探索 TypeScript 高级类型系统，包括条件类型、映射类型和模板字面量类型的实战应用...",
    publishedAt: "2026-01-05",
    readTime: "10 分钟",
    tags: ["TypeScript", "前端工程化"],
    link: "/blog/typescript-advanced"
  },
]

export function LatestBlogs() {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">最新文章</h2>
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          查看全部 →
        </Link>
      </div>
      
      <div className="space-y-4">
        {blogPosts.map((post) => (
          <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
            <Link href={post.link} className="block group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {post.publishedAt}
                </span>
              </div>
              
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 bg-secondary rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {post.readTime}
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}
