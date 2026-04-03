/**
 * 单套 Slidev 静态导出的元数据（与 public/slides/slides-manifest.json 对应）。
 *
 * 构建时不要用手改 HTML/JS：在 Slidev 项目里为「将要放进本站的目录 id」指定 base，一次即可。
 * 例（id 与 manifest、decks 子目录名一致，末尾保留 /）：
 *   slidev build --base /slides/decks/<id>/
 * 或在 vite / slidev 配置里写 base: '/slides/decks/<id>/'
 * 再整包复制到 public/slides/decks/<id>/，无需再改资源路径或路由前缀。
 */
export interface SlideDeckMeta {
  /** 目录名，默认对应 public/slides/decks/{id}/ */
  id: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  /** ISO 8601，用于展示与排序 */
  createdAt: string
  /** 站点根路径下的封面图，如 /slides/decks/foo/cover.png */
  cover?: string
  /** 演示入口；默认 /slides/decks/{id}/（由 Next fallback rewrite 回退到 index.html；勿在 URL 中写 index.html 以免 Slidev 路由误判） */
  entry?: string
  tags?: string[]
}

export interface SlidesManifest {
  slides: SlideDeckMeta[]
}
