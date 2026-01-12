// 消息类型定义
export interface Message {
  id: string;
  content: string;
  sendBySelf: boolean;
  type?: 'text' | 'file';
  fileInfo?: {
    key: string;
    name: string;
    size?: number;
  };
  timestamp?: number;
}

// 连接状态类型
export type ConnectionStatus = 
  | 'not-connected' 
  | 'connecting' 
  | 'connected' 
  | 'connect-fail' 
  | 'connect-interupt';

// WebSocket消息类型
export interface WSMessage {
  type: 'text' | 'file';
  content?: string;
  fileInfo?: {
    key: string;
    name: string;
    size?: number;
  };
}
