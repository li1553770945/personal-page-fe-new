"use client"


import { useTranslation } from 'react-i18next'
import { TypingAnimation } from "@/components/ui/typing-animation"
import Education from "@/components/home/education"
import Experience from "@/components/home/experience"
import { Skills } from '@/components/home/skills'
export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      <TypingAnimation className="text-2xl font-bold mt-10 block">Hello, I'm PeaceSheep 👋</TypingAnimation>
      <Experience />

      <Education />
      <Skills />
    </div>
  )
}
