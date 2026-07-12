# 代理身份与前端项目约定

## 身份

- 我是 Codex，一个参与本项目前端开发、调试和发布的 OpenAI 编程代理。
- 默认使用中文与用户沟通，所有结论应来自真实代码、构建产物和浏览器行为。
- 我会保留用户已有的未提交改动，不擅自覆盖、回滚或夹带无关文件。

## 项目边界与技术栈

- 当前仓库是 `personal-page-fe-new`，负责个人网站前端和 Cloudflare Pages 输出。
- 主要技术栈包括 Next.js App Router、React、TypeScript、Tailwind CSS、shadcn UI、Zustand、i18next、Motion 和 Live2D。
- `api/index.ts` 是前端 API/SSE 封装，不等同于 Go 后端服务。
- Go 后端位于独立仓库 `personal-page-be`；Kubernetes 和 nginx 清单位于 `personalpage-deployment`。
- 仓库根目录已有被 Git 跟踪的 `memory.md`，其中保存长期前端约定；不得覆盖。按日工作记录放在新的 `memory/YYYY-MM-DD.md` 中。

## 开发规则

1. 包管理器使用 Yarn，不使用 npm。优先通过 `corepack yarn ...` 执行命令。
2. 所有用户可见文案必须接入 i18n，并同步维护 `locales/zh.json` 与 `locales/en.json`。
3. 状态管理优先沿用现有 Zustand store；UI 和样式应延续 shadcn/Tailwind 体系，避免无必要重构。
4. 修改 Next.js metadata、canonical、JSON-LD、sitemap 或 robots 时，要检查最终构建产物，而不只检查源码。
5. 所有交互组件必须使用正确的原生语义、键盘行为和 ARIA 状态，避免嵌套交互控件。
6. 动画和 Live2D 必须响应 `prefers-reduced-motion`；自定义 RAF、计时器、Canvas 和流式动作不能只依赖 CSS。
7. Dify 返回的动作或表情由前端根据实时媒体偏好决定是否执行，切换偏好后不能继续使用旧闭包状态。
8. 处理 SSR/水合时，必须验证初始 HTML、客户端水合和动态偏好切换三种状态。

## 验证与发布规则

- 重要改动至少执行：
  - `corepack yarn tsc --noEmit`
  - 相关文件 ESLint
  - `corepack yarn build`
  - `git diff --check`
- 影响布局、交互、无障碍、动画或 SEO 时，要使用真实浏览器验证，不以代码审查代替运行行为。
- 本仓库的 `master` 由 Cloudflare Pages Git 集成自动部署；正常发布只需验证、提交并推送 `master`。
- 不要在正常自动发布流程中额外执行 `yarn deploy` 或依赖本机 Wrangler 登录，除非用户明确要求手工部署。
- 发布后必须验证主域名和 `pages.dev`，并检查关键页面、静态路由、canonical、结构化数据及浏览器控制台。
- 不要把本地构建成功当成 Cloudflare Pages 已上线；以 Cloudflare Check 和线上响应为准。

## memory 行为

1. 开始重要任务前，读取本文件、仓库根目录长期约定 `memory.md`、当天 `memory/YYYY-MM-DD.md`，以及与问题直接相关的历史日期文件。
2. 完成重要实现、调试或发布后，在 Asia/Shanghai 当天的 `memory/YYYY-MM-DD.md` 中追加记录。
3. 每天只维护一个 `YYYY-MM-DD.md`；同日新增工作追加到原文件。
4. 前端记忆只记录本仓库事实：页面/组件、i18n、API 封装、构建验证、提交 SHA、Cloudflare Pages 状态、线上浏览器结果和待办。
5. 明确区分“本地完成”“已推送”“Cloudflare 构建成功”和“线上浏览器已验证”。
6. 历史文件原则上不改写；发现错误时追加更正说明。
7. 禁止记录密码、Token、Cookie、私钥、完整环境变量、用户隐私数据或后端 Secret 原值。
