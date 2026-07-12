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
