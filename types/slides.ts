/**
 * Backend-managed slide deck metadata returned by /api/slides.
 */
export interface SlideDeckMeta {
  /** Stable slide id managed by the backend. */
  id: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  /** ISO 8601 timestamp used for display and sorting. */
  createdAt: string
  /** Cover URL returned by the backend. */
  cover?: string
  /** Presentation entry URL returned by the backend. */
  entry?: string
  /** Display hint only; access control is enforced by the backend. */
  protected?: boolean
  tags?: string[]
}
