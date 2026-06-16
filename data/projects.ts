export type SupportedProjectLocale = "zh" | "en"

export type ProjectStatus = "active" | "completed" | "maintained" | "experiment"

export type ProjectLinkType = "website" | "github" | "docs" | "package" | "article"

export type LocalizedProjectText = {
  title?: string
  summary?: string
  period?: string
  role?: string
  tags?: string[]
  techStack?: string[]
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
    id: "agentruler",
    title: "AgentRuler",
    summary:
      "面向 AI Agent 开发者的开发验证一体化平台，提供从 MCP 调试、Agent 验证到部署协作的统一工作流，帮助团队更快构建、测试并发布 AI Agent。",
    period: "2026.06 - 至今",
    startDate: "2026-06-01",
    status: "active",
    importance: 102,
    featured: true,
    role: "核心开发 / 产品工程",
    tags: ["AI Agent", "MCP", "Developer Tool", "Open Source"],
    techStack: ["TypeScript", "MCP", "Agent 验证", "桌面客户端", "Cloud"],
    highlights: [
      "承接 OpenMCP 的核心能力，将 MCP 调试、Agent 开发验证和部署协作整合到统一产品体验中。",
      "面向开发者提供统一界面，支持 AI Agent 的开发、调试、测试和验证，降低从原型到可发布应用的工程摩擦。",
      "围绕桌面客户端与 Cloud 部署能力演进，帮助团队把大模型能力转化为更确定、可交付的线上业务。",
    ],
    links: [
      {
        label: "项目官网",
        href: "https://agent-ruler.com/",
        type: "website",
      },
    ],
    sourceNote: "",
    locales: {
      en: {
        summary:
          "An integrated development and validation platform for AI Agent developers, bringing MCP debugging, Agent validation, and deployment collaboration into one workflow.",
        period: "Jun 2026 - Present",
        role: "Core development / product engineering",
        tags: ["AI Agent", "MCP", "Developer Tool", "Open Source"],
        techStack: ["TypeScript", "MCP", "Agent Validation", "Desktop Client", "Cloud"],
        highlights: [
          "Takes over the core capabilities of OpenMCP and brings MCP debugging, Agent development validation, and deployment collaboration into a unified product experience.",
          "Provides a unified interface for developing, debugging, testing, and validating AI Agents, reducing engineering friction from prototype to release.",
          "Evolves around desktop client and Cloud deployment capabilities, helping teams turn LLM behavior into more reliable online business workflows.",
        ],
        links: [
          {
            label: "Website",
            href: "https://agent-ruler.com/",
            type: "website",
          },
        ],
        sourceNote: "",
      },
    },
  },
  {
    id: "shitang",
    title: "食探",
    summary:
      "AI 饮食识别与健康管理小程序，围绕食物拍照识别、热量与营养估算、日常饮食记录和健身管理，把健康饮食从抽象建议转化为可执行的数据反馈。",
    period: "2025.01 - 至今",
    startDate: "2025-01-01",
    status: "active",
    importance: 96,
    featured: true,
    role: "产品与核心工程 / 智健启能（北京）科技有限公司",
    tags: ["AI", "健康管理", "饮食记录", "小程序"],
    techStack: ["AI 食物识别", "营养估算", "小程序", "数据反馈"],
    highlights: [
      "围绕拍照识别食物、估算热量与营养、辅助用户完成饮食记录和健身管理等核心场景设计产品能力。",
      "通过 Healthy Max 宣传页对外展示，将产品方向从“大而全”的健康平台逐步收敛到饮食识别与记录的高频闭环。",
      "关注健康饮食建议的可执行性，用结构化记录和数据反馈帮助用户形成持续的饮食管理习惯。",
    ],
    links: [
      {
        label: "项目官网",
        href: "https://healthymax.cn/",
        type: "website",
      },
    ],
    sourceNote: "",
    locales: {
      en: {
        title: "Shitang",
        summary:
          "An AI-powered food recognition and health management mini program focused on meal photo recognition, calorie and nutrition estimation, daily diet logging, and fitness support.",
        period: "Jan 2025 - Present",
        role: "Product and core engineering / Zhijian Qineng (Beijing) Technology Co., Ltd.",
        tags: ["AI", "Health Management", "Diet Logging", "Mini Program"],
        techStack: ["AI Food Recognition", "Nutrition Estimation", "Mini Program", "Data Feedback"],
        highlights: [
          "Designed the core product experience around food photo recognition, calorie and nutrition estimation, diet logging, and fitness management.",
          "Presented publicly through the Healthy Max landing page, with the product direction narrowing from a broad health platform into a focused diet recognition and logging workflow.",
          "Turns abstract healthy eating guidance into structured records and actionable feedback that users can follow day to day.",
        ],
        links: [
          {
            label: "Website",
            href: "https://healthymax.cn/",
            type: "website",
          },
        ],
        sourceNote: "",
      },
    },
  },
  {
    id: "coachlink",
    title: "教链 CoachLink",
    summary:
      "面向教练和学员的线上教学平台，帮助线上健身教练提升效率、规范学员管理、沉淀训练数据和反馈流程，替代微信等低效教学工作流。",
    period: "2025.01 - 至今",
    startDate: "2025-01-01",
    status: "active",
    importance: 95,
    featured: true,
    role: "产品与核心工程 / 智健启能（北京）科技有限公司",
    tags: ["健身教学", "SaaS", "小程序", "AI"],
    techStack: ["小程序", "Web 平台", "训练数据", "AI 计划生成"],
    highlights: [
      "围绕计划模板化、学员管理可视化、视频点评精准化、训练任务清晰化和训练评估工具重构线上教学流程。",
      "提供教练端效率工具、学员数据与任务可视化能力，并沉淀 Pull-up Index 等训练评估能力。",
      "面向未来叠加 AI 制定计划与知识库能力，为教练与学员建立可持续复用的数字化协作环境。",
    ],
    links: [
      {
        label: "项目官网",
        href: "https://coachlink.fit/login",
        type: "website",
      },
    ],
    sourceNote: "",
    locales: {
      en: {
        title: "CoachLink",
        summary:
          "An online coaching platform for fitness coaches and students, improving coaching efficiency, student management, training data collection, and feedback workflows.",
        period: "Jan 2025 - Present",
        role: "Product and core engineering / Zhijian Qineng (Beijing) Technology Co., Ltd.",
        tags: ["Fitness Coaching", "SaaS", "Mini Program", "AI"],
        techStack: ["Mini Program", "Web Platform", "Training Data", "AI Plan Generation"],
        highlights: [
          "Rebuilt online coaching workflows around plan templates, visual student management, precise video review, clear training tasks, and training evaluation tools.",
          "Provides coach-side efficiency tools, student data and task visualization, and Pull-up Index training evaluation capabilities.",
          "Designed to evolve with AI plan generation and knowledge base capabilities, creating a reusable digital collaboration environment for coaches and students.",
        ],
        links: [
          {
            label: "Website",
            href: "https://coachlink.fit/login",
            type: "website",
          },
        ],
        sourceNote: "",
      },
    },
  },
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
    techStack: localized?.techStack ?? base.techStack,
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
