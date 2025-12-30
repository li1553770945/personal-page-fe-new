// API Response Types
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

// Feedback Types
export interface FeedbackCategory {
  id: number;
  name: string;
}

export interface FeedbackResponse {
  uuid: string;
}
