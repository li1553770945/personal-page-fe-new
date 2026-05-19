"use client"

import { Hero } from "@/components/home/hero"
import Education from "@/components/home/education"
import Experience from "@/components/home/experience"
import { Skills } from "@/components/home/skills"
import { Awards } from "@/components/home/awards"
import { Publications } from "@/components/home/publications"

export default function Home() {
  return (
    <div>
      <Hero />
      <Experience />
      <Education />
      <Awards />
      <Skills />
      <Publications />
    </div>
  )
}
