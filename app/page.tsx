import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* subtle grid + glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Hero */}
        <header className="mb-14">
          <Badge className="bg-zinc-900/60 text-zinc-200 hover:bg-zinc-900 border border-zinc-800">
            Backend · Distributed Systems · AI Agent
          </Badge>

          <h1 className="mt-6 text-6xl font-black tracking-tight md:text-7xl">
            Peace<span className="text-amber-300">Sheep</span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            用克制的布局做大胆的视觉：深色基底 + 暗金强调 + 轻动效。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {/* 这里建议直接跳到 projects */}
            <a href="#projects">
              <Button className="bg-amber-300 text-zinc-950 hover:bg-amber-200">查看项目</Button>
            </a>
            <a href="#blog">
              <Button variant="secondary" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">读博客</Button>
            </a>
          </div>
        </header>

        {/* Bento container */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[200px]">
          {/* Projects */}
          <section id="projects" className="scroll-mt-24 md:col-span-2 md:row-span-2">
            <Card className="h-full border-zinc-800 bg-zinc-900/40">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">
                放你最硬核的一段：项目名/背景 + 2~3 条量化成果。
              </CardContent>
            </Card>
          </section>

          {/* Experience */}
          <section id="experience" className="scroll-mt-24 md:col-span-2">
            <Card className="h-full border-zinc-800 bg-zinc-900/40">
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">
                公司/岗位/方向 + 你最能打的一条成果（先写 1 条就行）。
              </CardContent>
            </Card>
          </section>

          {/* Skills */}
          <section id="skills" className="scroll-mt-24">
            <Card className="h-full border-zinc-800 bg-zinc-900/40">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">
                Go / Rust / K8s / Redis / MQ
              </CardContent>
            </Card>
          </section>

          {/* Awards */}
          <section id="awards" className="scroll-mt-24">
            <Card className="h-full border-amber-300/30 bg-amber-300/10">
              <CardHeader>
                <CardTitle className="text-amber-200">Awards</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-200">
                ICPC / 竞赛 / 亮点
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Blog placeholder（以后你接 MD/内容系统就放这里） */}
        <section id="blog" className="scroll-mt-24 mt-16">
          <h2 className="text-2xl font-bold">Blog</h2>
          <p className="mt-2 text-zinc-300">这里以后放最近文章列表。</p>
        </section>
      </div>
    </main>
  )
}
