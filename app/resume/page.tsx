"use client"

import { TypingAnimation } from "@/components/ui/typing-animation"
import Education from "@/components/home/education"
import Experience from "@/components/home/experience"
import { Skills } from '@/components/home/skills'
import { Awards } from '@/components/home/awards'
import { Publications } from '@/components/home/publications'

export default function Resume() {
  return (
    <div>
      <TypingAnimation className="text-2xl font-bold mt-10 block">Hello, I&apos;m PeaceSheep 👋</TypingAnimation>
      <Experience />
      <Education />
      <Awards />
      <Skills />
      <Publications />
    </div>
  )
}
