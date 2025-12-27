"use client"


import { useTranslation } from 'react-i18next'
import { TypingAnimation } from "@/components/ui/typing-animation"
import Education from "@/components/home/education"
import Experience from "@/components/home/experience"
export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
          <TypingAnimation className="text-2xl font-bold">Hello, I'm PeaceSheep 👋</TypingAnimation>
          <Education />
          <Experience />
    </div>
  )
}
