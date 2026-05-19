export type SupportedProjectLocale = "zh" | "en"

export type ProjectStatus = "active" | "completed" | "maintained" | "experiment"

export type ProjectLinkType = "website" | "github" | "docs" | "package" | "article"

export type LocalizedProjectText = {
  title?: string
  summary?: string
  period?: string
  role?: string
  tags?: string[]
  highlights?: string[]
  links?: ProjectLink[]
  sourceNote?: string
}

export type ProjectLink = {
  label: string
  href: string
  type: ProjectLinkType
}

export type Project = {
  id: string
  title: string
  summary: string
  period: string
  startDate: string
  status: ProjectStatus
  importance: number
  featured?: boolean
  role: string
  tags: string[]
  techStack: string[]
  highlights: string[]
  links: ProjectLink[]
  sourceNote?: string
  cover?: string
  locales?: Partial<Record<SupportedProjectLocale, LocalizedProjectText>>
}

export type ResolvedProject = Omit<Project, "locales"> & {
  locale: SupportedProjectLocale | "default"
}

export const projects: Project[] = [
  {
    id: "openmcp",
    title: "OpenMCP",
    summary:
      "面向 MCP 开发者的开发与调试平台，整合 VS Code 插件、CLI、SDK、调试面板和 Chat/资源管理能力，帮助开发者更快调试、验证和交付 MCP Server。",
    period: "2025.05 - 至今",
    startDate: "2025-05-01",
    status: "active",
    importance: 100,
    featured: true,
    role: "核心开发 / 产品工程",
    tags: ["AI Infra", "MCP", "Developer Tool", "Open Source"],
    techStack: ["TypeScript", "Vue", "VS Code Extension", "CLI", "SDK", "MCP"],
    highlights: [
      "提供面向 MCP Server 的可视化调试工作流，覆盖工具调用、资源管理、Prompt、交互历史和多服务调试等场景。",
      "配套 CLI 与 SDK，支持从本地调试、交互验证到配置复用和应用交付的完整开发路径。",
      "公开项目已获得社区关注，GitHub 页面抓取时显示 747 stars、55 forks。",
    ],
    links: [
      {
        label: "项目官网",
        href: "https://openmcp.kirigaya.cn/",
        type: "website",
      },
      {
        label: "GitHub",
        href: "https://github.com/LSTM-Kirigaya/openmcp-client",
        type: "github",
      },
      {
        label: "文档",
        href: "https://openmcp.kirigaya.cn/plugin-tutorial/",
        type: "docs",
      },
    ],
    sourceNote: "",
    locales: {
      en: {
        summary:
          "A development and debugging platform for MCP developers, combining a VS Code extension, CLI, SDK, debug panel, chat, and resource management workflows to help developers validate and ship MCP Servers faster.",
        period: "May 2025 - Present",
        role: "Core development / product engineering",
        highlights: [
          "Provides a visual debugging workflow for MCP Servers, covering tool calls, resource management, prompts, interaction history, and multi-server debugging scenarios.",
          "Ships with CLI and SDK support, covering the path from local debugging and interactive validation to reusable configuration and application delivery.",
          "The public project has received community attention; the GitHub page showed 747 stars and 55 forks when reviewed.",
        ],
        links: [
          {
            label: "Website",
            href: "https://openmcp.kirigaya.cn/",
            type: "website",
          },
          {
            label: "GitHub",
            href: "https://github.com/LSTM-Kirigaya/openmcp-client",
            type: "github",
          },
          {
            label: "Docs",
            href: "https://openmcp.kirigaya.cn/plugin-tutorial/",
            type: "docs",
          },
        ],
        sourceNote: "",
      },
    },
  },
]

export function resolveProjectLocale(project: Project, locale: string): ResolvedProject {
  const normalizedLocale: SupportedProjectLocale = locale.toLowerCase().startsWith("en") ? "en" : "zh"
  const localized = project.locales?.[normalizedLocale]

  const { locales: _locales, ...base } = project
  void _locales

  return {
    ...base,
    ...localized,
    title: localized?.title ?? base.title,
    summary: localized?.summary ?? base.summary,
    period: localized?.period ?? base.period,
    role: localized?.role ?? base.role,
    tags: localized?.tags ?? base.tags,
    highlights: localized?.highlights ?? base.highlights,
    links: localized?.links ?? base.links,
    sourceNote: localized?.sourceNote ?? base.sourceNote,
    locale: localized ? normalizedLocale : "default",
  }
}

export function sortProjectsByTime<T extends Pick<Project, "startDate">>(items: T[]) {
  return [...items].sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate))
}

export function sortProjectsByImportance<T extends Pick<Project, "startDate" | "importance">>(items: T[]) {
  return [...items].sort((a, b) => b.importance - a.importance || Date.parse(b.startDate) - Date.parse(a.startDate))
}
