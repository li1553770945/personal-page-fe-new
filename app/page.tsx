"use client"

import { TypingAnimation } from "@/components/ui/typing-animation"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { LatestBlogs } from "@/components/home/latest-blogs"
import { Skills } from '@/components/home/skills'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="mt-10 mb-8">
        <TypingAnimation className="text-3xl font-bold block mb-4">
          Hello, I&apos;m PeaceSheep 👋
        </TypingAnimation>
        <p className="text-muted-foreground text-lg max-w-2xl">
          全栈工程师 | 热爱技术 | 持续学习
        </p>
        <div className="flex gap-3 mt-6">
          <Link href="/resume">
            <Button variant="outline">查看完整简历</Button>
          </Link>
          <Link href="/chat">
            <Button>与我聊天</Button>
          </Link>
        </div>
      </div>

      {/* Featured Content */}
      <FeaturedProjects />
      <LatestBlogs />
      
      {/* Quick Overview - 简化的技能展示 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">技能概览</h2>
        <Skills />
      </div>
    </div>
  )
}
