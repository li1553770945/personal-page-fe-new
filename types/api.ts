// API Response Types
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// Feedback Types
export interface FeedbackCategory {
  id: number;
  name: string;
}

export interface FeedbackResponse {
  uuid: string;
}

export interface RoomData {
  roomId: string;
  clientId: string;
  clientToken: string;
}

export interface FileDownloadData {
  signedUrl: string;
}

export interface FileUploadData {
  key: string;
  name: string;
  size: number;
}

export interface UploadUrlResponse {
  key: string;
  signedUrl: string;
}

export type UserRole = "super_admin" | "admin" | "user";

export interface CurrentUserData {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  role: UserRole;
  can_use: boolean;
}

export interface AdminUserData extends CurrentUserData {
  is_activate: boolean;
  created_at: number;
  updated_at: number;
}

export interface ActivateCodeData {
  activate_code?: string;
  activeCode?: string;
}

export interface UserDangerActionRequest {
  username: string;
  reason?: string;
}

export interface UserDangerActionData {
  user?: AdminUserData;
  activate_code?: string;
  activeCode?: string;
  related_files: number;
}

export interface AIUsageStatsTotals {
  request_count: number;
  success_count: number;
  failed_count: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  total_price: number;
  currency: string;
}

export interface AIUsageStatsDay extends AIUsageStatsTotals {
  date: string;
}

export interface AIUsageStatsData {
  scope: "user" | "admin";
  from: string;
  to: string;
  totals: AIUsageStatsTotals;
  days: AIUsageStatsDay[];
}

export interface ManagedFileData {
  id: number;
  user_id: number;
  username: string;
  nickname: string;
  name: string;
  key: string;
  kind: "object" | "local";
  count: number;
  max_download: number;
  download_count: number;
  created_at: number;
  updated_at: number;
}

export interface SlideData {
  database_id: number;
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  cover?: string;
  coverObjectPath?: string;
  entry?: string;
  objectPrefix?: string;
  tags?: string[];
  protected: boolean;
  password?: string;
  has_password: boolean;
  created_at: number;
  updated_at: number;
}

export interface SaveSlideRequest {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  cover?: string;
  coverObjectPath?: string;
  entry?: string;
  objectPrefix?: string;
  tags?: string[];
  protected: boolean;
  password?: string;
}

export interface SlideUploadResponse {
  id?: string;
  entry?: string;
  objectPrefix?: string;
  cover?: string;
  coverObjectPath?: string;
  fileCount?: number;
}

export interface SlideUploadFileRequest {
  path: string;
  contentType?: string;
}

export interface SignSlideDeckUploadRequest {
  id?: string;
  databaseId?: number;
  files: SlideUploadFileRequest[];
}

export interface SlideSignedUploadData {
  path: string;
  objectPath: string;
  signedUrl: string;
  contentType?: string;
}

export interface SlideDeckUploadSignResponse {
  id: string;
  entry: string;
  objectPrefix: string;
  fileCount: number;
  uploads: SlideSignedUploadData[];
}

export interface SignSlideCoverUploadRequest {
  id?: string;
  databaseId?: number;
  fileName: string;
  contentType?: string;
}

export interface SlideCoverUploadSignResponse {
  id: string;
  cover: string;
  coverObjectPath: string;
  signedUrl: string;
  contentType?: string;
}

export type BlogPostStatus = "draft" | "published" | "archived";

export interface BlogPostData {
  databaseId: number;
  slug: string;
  legacyPermalink?: string;
  status: BlogPostStatus;
  title: string;
  description: string;
  contentMarkdown?: string;
  cover?: string;
  coverObjectPath?: string;
  categories: string[];
  tags: string[];
  draftRevisionId?: number;
  publishedRevisionId?: number;
  revisionId?: number;
  version?: number;
  changeSummary?: string;
  authorUsername?: string;
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}

export interface BlogPostListData {
  items: BlogPostData[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BlogRevisionData {
  revisionId: number;
  postId: number;
  version: number;
  title: string;
  description: string;
  contentMarkdown: string;
  cover: string;
  coverObjectPath?: string;
  categories: string[];
  tags: string[];
  changeSummary: string;
  authorUsername: string;
  createdAt: number;
}

export interface SaveBlogPostRequest {
  slug: string;
  title: string;
  description: string;
  contentMarkdown: string;
  cover?: string;
  coverObjectPath?: string;
  categories: string[];
  tags: string[];
  changeSummary?: string;
  baseRevisionId?: number;
  legacyPermalink?: string;
  publishAfterSave?: boolean;
}

export interface SignBlogAssetRequest {
  postId: number;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface BlogAssetData {
  id: number;
  postId: number;
  objectPath: string;
  fileName: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  alt: string;
  url: string;
  signedUrl?: string;
  ready: boolean;
}
