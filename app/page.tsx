"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* subtle grid + glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Hero */}
        <header className="mb-14">
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:border-zinc-800">
            {t('hero.badge')}
          </Badge>

          <h1 className="mt-6 text-6xl font-black tracking-tight text-gray-900 md:text-7xl dark:text-zinc-50">
            {t('hero.title')}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-zinc-300">
            {t('hero.description')}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects">
              <Button className="bg-amber-300 text-zinc-950 hover:bg-amber-200">{t('hero.viewProjects')}</Button>
            </a>
            <a href="#blog">
              <Button variant="secondary" className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800">{t('hero.readBlog')}</Button>
            </a>
          </div>
        </header>

        {/* Bento container */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[200px]">
          {/* Projects */}
          <section id="projects" className="scroll-mt-24 md:col-span-2 md:row-span-2">
            <Card className="h-full border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/40">
              <CardHeader>
                <CardTitle>{t('projects.title')}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-zinc-300">
                {t('projects.content')}
              </CardContent>
            </Card>
          </section>

          {/* Experience */}
          <section id="experience" className="scroll-mt-24 md:col-span-2">
            <Card className="h-full border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/40">
              <CardHeader>
                <CardTitle>{t('experience.title')}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-zinc-300">
                {t('experience.content')}
              </CardContent>
            </Card>
          </section>

          {/* Skills */}
          <section id="skills" className="scroll-mt-24">
            <Card className="h-full border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/40">
              <CardHeader>
                <CardTitle>{t('skills.title')}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-zinc-300">
                {t('skills.content')}
              </CardContent>
            </Card>
          </section>

          {/* Awards */}
          <section id="awards" className="scroll-mt-24">
            <Card className="h-full border-amber-300/30 bg-amber-300/10">
              <CardHeader>
                <CardTitle className="text-amber-200 dark:text-amber-200">{t('awards.title')}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-800 dark:text-zinc-200">
                {t('awards.content')}
              </CardContent>
            </Card>
          </section>
        </div>

        <section id="blog" className="scroll-mt-24 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">{t('blog.title')}</h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-300">{t('blog.content')}</p>
        </section>
      </div>
    </main>
  )
}
