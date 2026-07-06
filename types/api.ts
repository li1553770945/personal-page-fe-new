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
  entry?: string;
  objectPrefix?: string;
  tags?: string[];
  protected: boolean;
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
  entry?: string;
  objectPrefix?: string;
  tags?: string[];
  protected: boolean;
  password?: string;
}
