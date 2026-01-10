import instance from "../lib/requests";
import type { ApiResponse, FeedbackCategory, FeedbackResponse } from "../types/api";

export const logoutAPI = () => instance.get("/users/logout");

// post请求，有参数
export const loginAPI = (data: any) =>
  instance.post("/auth/login", data);

export const registerAPI = (data: any) =>
  instance.post("/users/register", data);

export const generateCodeAPI = (data: any) =>
  instance.post("/users/activate-code", data);

export const userInfoAPI = () =>
  instance.get(`/users/me`);


export const downloadFileAPI = (key: string) =>
  instance.get(`/files/download?key=${key}`);

export const fileInfoAPI = (key: string) =>
  instance.get(`/files?key=${key}`);


export const deleteFileAPI = (key: string) =>
  instance.delete(`/files`, { data: { key: key } });

export const uploadFileAPI = (data: any) =>
  instance.post(`/files`, data);

export const allFeedbackCategoriesAPI = (): Promise<ApiResponse<FeedbackCategory[]>> =>
  instance.get('/feedback/categories')

export const saveFeedbackAPI = (data: any): Promise<ApiResponse<FeedbackResponse>> =>
  instance.post("/feedback", data);

export const getReplyAPI = (uuid: string) =>
  instance.get(`/feedback/reply?feedbackUuid=${uuid}`);

export const addReplyAPI = (data: any) =>
  instance.post("/feedback/reply", data);


export const getFeedbackAPI = (uuid: string) =>
  instance.get("/feedback?uuid=" + uuid);

export const notReadFeedbackAPI = () =>
  instance.get("/feedback/unread");

export const getProjectsNumAPI = () =>
  instance.get("/projects/num");

export const getProjectsAPI = (start: number, end: number, status: number, order: string) =>
  instance.get("/projects?start=" + start + "&end=" + end + "&status=" + status + "&order=" + order);

export const addProjectAPI = (data: any) =>
  instance.post("/projects", data);

export const deleteProjectAPI = (id: number) =>
  instance.delete("/projects/" + id);

export const createRoomAPI = () =>
  instance.post("/rooms");

export const joinRoomAPI = (roomId: string) =>
  instance.post(`/rooms/join/?roomId=${roomId}`);

// AI聊天接口，使用SSE
interface ChatMessage {
  event_type: string;
  data: string;
}

// 定义回调接口
export interface SSECallback {
  onMessage: (content: ChatMessage) => void;
  onFinished: () => void;
  onError: (error: Error) => void;
}

export interface AIChatRequest {
  message: string;
  conversation_id?: string;
}
export const aiChatAPI = async (request: AIChatRequest, callbacks: SSECallback) => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''; // 确保有默认值
  const endpoint = `${baseURL}/aichat`;

  // 获取 Token (token外部传递)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 1. 在这里带上 Bearer Token
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...request }),
    });

    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    // 非 2xx 的响应：尽量读取服务端错误信息并抛出
    if (!response.ok) {
      try {
        if (contentType.includes('application/json')) {
          const errJson = await response.json();
          const msg = errJson?.message || errJson?.error || JSON.stringify(errJson);
          throw new Error(`HTTP ${response.status}: ${msg}`);
        } else {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText || response.statusText}`);
        }
      } catch (e) {
        // 如果解析失败，回退到通用错误
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    // 2xx 但非 SSE 的普通 JSON 响应：当作错误处理，避免前端卡死
    if (!contentType.includes('text/event-stream')) {
      try {
        const data = await response.json();
        const msg = data?.message || data?.error || (data?.code ? `code=${data.code}` : '') || '非SSE响应';
        // 直接走错误回调，让上层展示错误信息
        callbacks.onError(new Error(msg));
        return;
      } catch (e) {
        // 不是 JSON，就读取文本并抛错
        const text = await response.text();
        callbacks.onError(new Error(text || '非SSE响应且内容不可解析'));
        return;
      }
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser.');
    }

    // 3. 解析 SSE 响应流
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 将二进制流解码为文本
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      const lines = buffer.split('\n');
      // 保留最后一行（因为它可能是不完整的，等待下一次循环拼接）
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        // 过滤掉空行、注释行、id 行、event 行，只处理 data 行
        if (!trimmedLine || !line.startsWith('data:')) {
          continue;
        }

        const dataStr = line.replace('data:', '').trim();

        try {
          const data = JSON.parse(dataStr);
          console.debug('Received SSE JSON content:', data);
          callbacks.onMessage(data);
        } catch (e) {
          // 如果JSON解析失败，直接使用原始文本
          console.warn('JSON parse failed, using raw text:', e, 'Data:', dataStr);
          if (dataStr && typeof dataStr === 'string') {
            console.debug('Received SSE raw text:', dataStr);
            callbacks.onMessage({ event_type: 'message', data: dataStr });
          }
        }

      }
    }

    // 循环结束，任务完成
    callbacks.onFinished();

  } catch (error) {
    callbacks.onError(error as Error);
  }
};