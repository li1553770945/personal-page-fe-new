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
      "围绕 AI Agent 开发与 MCP 调试流程的工程实践项目，重点探索工具调用调试、行为验证、配置管理和桌面端工作台体验。",
    period: "2026.06 - 至今",
    startDate: "2026-06-01",
    status: "active",
    importance: 102,
    featured: true,
    role: "核心开发 / 产品工程",
    tags: ["AI Agent", "MCP", "Developer Tool", "Open Source"],
    techStack: ["TypeScript", "MCP", "Agent 验证", "桌面客户端", "Cloud"],
    highlights: [
      "将 MCP Server 调试、Agent 行为验证和配置复用整理为统一工作流，降低多工具切换带来的上下文损耗。",
      "实现面向开发者的桌面端交互界面，覆盖连接管理、工具调用、资源查看、调试记录和验证结果展示等场景。",
      "围绕可复现验证、状态可观测和发布前检查设计工程链路，帮助 Agent 项目从原型走向更稳定的交付形态。",
    ],
    links: [],
    sourceNote: "",
    locales: {
      en: {
        summary:
          "An engineering practice project around AI Agent development and MCP debugging, focused on tool-call debugging, behavior validation, configuration management, and desktop workbench UX.",
        period: "Jun 2026 - Present",
        role: "Core development / product engineering",
        tags: ["AI Agent", "MCP", "Developer Tool", "Open Source"],
        techStack: ["TypeScript", "MCP", "Agent Validation", "Desktop Client", "Cloud"],
        highlights: [
          "Organized MCP Server debugging, Agent behavior validation, and reusable configuration into a unified development workflow.",
          "Built a desktop-facing developer interface covering connection management, tool calls, resource inspection, debug history, and validation results.",
          "Designed engineering paths around reproducible validation, observable state, and pre-release checks for more stable Agent delivery.",
        ],
        links: [],
        sourceNote: "",
      },
    },
  },
  {
    id: "shitang",
    title: "食探",
    summary:
      "围绕饮食记录场景的 AI 图像识别与结构化数据实践，重点关注食物识别、营养信息估算、记录建模和移动端交互反馈。",
    period: "2025.01 - 至今",
    startDate: "2025-01-01",
    status: "active",
    importance: 96,
    featured: true,
    role: "产品与核心工程",
    tags: ["AI", "图像识别", "数据建模", "小程序"],
    techStack: ["AI 食物识别", "营养估算", "小程序", "结构化记录"],
    highlights: [
      "设计拍照识别到结构化记录的端到端流程，包括图像输入、识别结果校正、营养字段抽取和记录落库。",
      "抽象食物、餐次、营养指标和用户反馈等核心数据模型，为后续检索、统计和趋势分析保留稳定结构。",
      "在移动端交互中处理识别不确定性，通过可编辑结果、状态提示和历史记录提升数据录入的可用性。",
    ],
    links: [],
    sourceNote: "",
    locales: {
      en: {
        title: "Shitang",
        summary:
          "An AI image-recognition and structured-data practice project for diet logging, focused on food recognition, nutrition estimation, record modeling, and mobile feedback loops.",
        period: "Jan 2025 - Present",
        role: "Product and core engineering",
        tags: ["AI", "Image Recognition", "Data Modeling", "Mini Program"],
        techStack: ["AI Food Recognition", "Nutrition Estimation", "Mini Program", "Structured Records"],
        highlights: [
          "Designed the end-to-end flow from meal photo input to structured records, including result correction, nutrition field extraction, and persistence.",
          "Modeled food, meal, nutrition metric, and user feedback entities so later retrieval, statistics, and trend analysis can build on stable structures.",
          "Handled recognition uncertainty in the mobile UX through editable results, state feedback, and historical records.",
        ],
        links: [],
        sourceNote: "",
      },
    },
  },
  {
    id: "coachlink",
    title: "教链 CoachLink",
    summary:
      "围绕训练计划、动作记录和反馈流程的数据化实践，重点探索任务编排、训练数据沉淀、视频点评和评估指标建模。",
    period: "2025.01 - 至今",
    startDate: "2025-01-01",
    status: "active",
    importance: 95,
    role: "产品与核心工程",
    tags: ["训练数据", "Web 平台", "小程序", "AI"],
    techStack: ["小程序", "Web 平台", "训练数据", "AI 计划生成"],
    highlights: [
      "抽象训练计划、动作模板、任务执行和阶段反馈等对象，构建可追踪的训练数据流。",
      "实现面向视频点评和训练记录的交互流程，支持动作片段、反馈内容和评估结果之间的结构化关联。",
      "探索基于历史记录和训练目标的计划生成能力，将规则模板与 AI 辅助生成结合到可审核的工作流中。",
    ],
    links: [],
    sourceNote: "",
    locales: {
      en: {
        title: "CoachLink",
        summary:
          "A data-oriented practice project around training plans, movement records, and feedback workflows, focused on task orchestration, training data, video review, and evaluation modeling.",
        period: "Jan 2025 - Present",
        role: "Product and core engineering",
        tags: ["Training Data", "Web Platform", "Mini Program", "AI"],
        techStack: ["Mini Program", "Web Platform", "Training Data", "AI Plan Generation"],
        highlights: [
          "Modeled training plans, movement templates, task execution, and staged feedback as traceable training data flows.",
          "Implemented interaction flows for video review and training records, linking movement segments, feedback, and evaluation results structurally.",
          "Explored plan-generation workflows that combine rule templates with AI assistance while keeping generated plans reviewable.",
        ],
        links: [],
        sourceNote: "",
      },
    },
  },
  {
    id: "openmcp",
    title: "OpenMCP",
    summary:
      "面向 MCP 开发者的开发与调试平台，整合 VS Code 插件、CLI、SDK、调试面板和 Chat/资源管理能力，帮助开发者更快调试、验证和交付 MCP Server。",
    period: "2025.05 - 2026.05",
    startDate: "2025-05-01",
    status: "completed",
    importance: 100,
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
        period: "May 2025 - May 2026",
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
