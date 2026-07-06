"use client"

import Link from "next/link"
import { ArrowUpDown, CalendarDays, ExternalLink, Github, Globe2, LibraryBig, Package } from "lucide-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  projects,
  resolveProjectLocale,
  sortProjectsByImportance,
  sortProjectsByTime,
  type ProjectLinkType,
  type ProjectStatus,
} from "@/data/projects"
import { cn } from "@/lib/utils"

type SortMode = "time" | "importance"

const linkIcon: Record<ProjectLinkType, React.ElementType> = {
  website: Globe2,
  github: Github,
  docs: LibraryBig,
  package: Package,
  article: ExternalLink,
}

export default function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const [sortMode, setSortMode] = useState<SortMode>("time")

  const localizedProjects = useMemo(
    () => projects.map((project) => resolveProjectLocale(project, i18n.language || "zh")),
    [i18n.language]
  )

  const sortedProjects = useMemo(() => {
    if (sortMode === "importance") {
      return sortProjectsByImportance(localizedProjects)
    }
    return sortProjectsByTime(localizedProjects)
  }, [localizedProjects, sortMode])

  return (
    <div className="mx-auto w-full max-w-6xl py-10 md:py-14">
      <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-normal md:text-4xl">{t("projects.title")}</h1>
            <p className="text-base leading-7 text-muted-foreground md:text-lg">{t("projects.description")}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <ArrowUpDown className="size-4 text-muted-foreground" />
          <Select value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
            <SelectTrigger className="w-full md:w-[180px]" aria-label={t("projects.sort.ariaLabel")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">{t("projects.sort.time")}</SelectItem>
              <SelectItem value="importance">{t("projects.sort.importance")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="space-y-5">
        {sortedProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden rounded-lg border-border/70 bg-card/80 py-0 shadow-sm">
            <CardHeader className="gap-4 p-5 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-2xl leading-tight">{project.title}</CardTitle>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {t(`projects.status.${project.status as ProjectStatus}`)}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-300">
                        {t("projects.featured")}
                      </span>
                    ) : null}
                  </div>
                  <p className="max-w-4xl text-sm leading-6 text-muted-foreground md:text-base">{project.summary}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-md border border-border/70 bg-background/60 px-3 py-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {project.period}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-5 pt-0 md:p-6 md:pt-0">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">{t("projects.fields.role")}</p>
                  <p className="text-sm font-medium text-foreground">{project.role}</p>
                  <p className="pt-2 text-xs font-semibold uppercase text-muted-foreground">{t("projects.fields.techStack")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-md border border-border/70 px-2 py-1 text-xs text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">{t("projects.fields.highlights")}</p>
                  <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {project.links.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.links.map((link) => {
                    const Icon = linkIcon[link.type]
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: link.type === "website" ? "default" : "outline", size: "sm" }))}
                      >
                        <Icon className="size-4" />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              ) : null}

              {project.sourceNote ? <p className="text-xs text-muted-foreground/80">{project.sourceNote}</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
