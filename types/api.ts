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
