该文档记录了我在项目中使用的一些技术、工具、以及其他全局信息，你可以根据需要编辑该文档，记录一些全局的记忆信息。

你的思考和信息输出应当使用中文。

项目使用yarn作为包管理工具而不是npm，在运行命令时也需要使用yarn而不是npm，例如：
```
yarn install
yarn dev
```

我的项目使用了i18n来实现多语言支持，i18n的配置文件在`locales`目录下，每个语言对应一个json文件，例如`en.json`、`zh.json`等，使用的方法为：

```typescript
import { useTranslation } from "react-i18next"
const { t } = useTranslation()
t("files.title")
```

任何需要在界面显示的文本，都需要使用i18n来实现多语言支持。


我使用 yarn 作为包管理器。

我使用 Zustand 进行状态管理。

我使用 shadcn UI 作为主要的组件库，可以使用基于 shadcn UI 的其他 UI 库，例如：Magic UI、Aaceternity、Coss UI、Cult UI。

我使用 tailwind CSS 进行样式设计。

可以使用context\notification.tsx中的函数来弹出通知。

2026-01-10：为主页新增获奖展示（`components/home/awards.tsx`），使用 `awards.*` i18n 配置，并在 `locales/en.json`、`locales/zh.json` 中维护获奖列表。

2026-01-12：实现临时聊天室功能：
- 创建了 Zustand store（`store/chatStore.ts`）管理聊天室状态、连接状态、消息等
- 聊天室组件位于 `components/chat/` 目录：
  - `header-room-controls.tsx`：房间控制组件，包括创建/加入房间、显示连接状态
  - `message-display.tsx`：消息展示组件，支持文本和文件消息，自动滚动
  - `message-input.tsx`：消息输入组件，支持文本和文件发送
- 主页面位于 `app/chat/page.tsx`，支持通过 URL 参数自动加入聊天室
- i18n 配置已添加到 `locales/zh.json` 和 `locales/en.json`，使用 `chat.*` 命名空间
- WebSocket 连接需要配置 `NEXT_PUBLIC_WS_URL` 环境变量