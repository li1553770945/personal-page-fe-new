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

2026-01-10：为主页新增获奖展示（`components/home/awards.tsx`），使用 `awards.*` i18n 配置，并在 `locales/en.json`、`locales/zh.json` 中维护获奖列表。