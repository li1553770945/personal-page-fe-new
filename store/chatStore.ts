import { create } from 'zustand';
import { ConnectionStatus, Message } from '@/types/chat';
import { createRoomAPI, joinRoomAPI } from '@/api';
import { useNotificationStore } from '@/context/notification';

interface ChatState {
  // 房间相关
  curRoomId: string;
  clientId: string;
  clientToken: string;
  inputRoomId: string;
  lastRoomId: string;

  // 连接状态
  connectionStatus: ConnectionStatus;
  statusText: string;
  dialogVisible: boolean;

  // 加载状态
  creating: boolean;
  joining: boolean;
  rejoining: boolean;
  retryCount: number;
  needReconnect: boolean;

  // WebSocket
  ws: WebSocket | null;
  heartbeatInterval: NodeJS.Timeout | null;

  // 消息
  messages: Message[];

  // Actions
  setInputRoomId: (id: string) => void;
  createRoom: () => Promise<boolean>;
  joinRoom: (roomId: string) => Promise<boolean>;
  reJoinRoom: () => void;
  connect: (roomId: string) => void;
  disconnect: () => void;
  sendMessage: (content: string) => boolean;
  sendFileMessage: (fileInfo: { key: string; name: string; size: number }) => boolean;
  addMessage: (msg: Message) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setDialogVisible: (visible: boolean) => void;
  startHeartbeat: () => void;
  stopHeartbeat: () => void;
}

// 获取状态文本
const getStatusText = (status: ConnectionStatus, retryCount: number = 0): string => {
  const statusMap: Record<ConnectionStatus, string> = {
    'not-connected': '未连接至服务器，请创建或加入对话',
    'connecting': '正在连接至服务器，请稍后',
    'connected': '已连接至服务器',
    'connect-fail': '与服务器连接失败，请刷新页面并重新创建对话',
    'connect-interupt': `连接中断，正在尝试第${retryCount}次重新连接`
  };
  return statusMap[status];
};

export const useChatStore = create<ChatState>((set, get) => ({
  curRoomId: '',
  clientId: '',
  clientToken: '',
  inputRoomId: '',
  lastRoomId: typeof window !== 'undefined' ? localStorage.getItem('roomId') || '' : '',
  connectionStatus: 'not-connected',
  statusText: '未连接至服务器，请创建或加入对话',
  dialogVisible: false,
  creating: false,
  joining: false,
  rejoining: false,
  retryCount: 1,
  needReconnect: true,
  ws: null,
  heartbeatInterval: null,
  messages: [],

  setInputRoomId: (id) => set({ inputRoomId: id }),

  createRoom: async () => {
    set({ creating: true });
    const { error: notificationError, success: notificationSuccess } = useNotificationStore.getState();
    try {
      const response = await createRoomAPI();
      console.log('创建房间响应数据:', response);
      if (response.code === 0) {
        const { roomId, clientId, clientToken } = response.data;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('roomId', roomId);
          localStorage.setItem('clientId', clientId);
          localStorage.setItem('clientToken', clientToken);
        }

        set({
          curRoomId: roomId,
          clientId,
          clientToken,
          lastRoomId: roomId,
          creating: false
        });
        notificationSuccess('创建房间成功', `房间id: ${roomId}`);
        return true;
      }
      // 服务器返回错误
      notificationError('创建失败', response.message || '创建房间失败');
      set({ creating: false });
      return false;
    } catch (error: any) {
      console.error('创建房间失败:', error);
      const errorMsg = error.response?.data?.message || error.message || '网络错误，请稍后重试';
      notificationError('创建失败', errorMsg);
      set({ creating: false });
      return false;
    }
  },

  joinRoom: async (roomId: string) => {
    set({ joining: true });
    const { error: notificationError, success: notificationSuccess } = useNotificationStore.getState();
    try {
      const response = await joinRoomAPI(roomId);
      if (response.code === 0) {
        const { clientId, clientToken } = response.data;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('roomId', roomId);
          localStorage.setItem('clientId', clientId);
          localStorage.setItem('clientToken', clientToken);
        }

        set({
          curRoomId: roomId,
          clientId,
          clientToken,
          lastRoomId: roomId,
          joining: false
        });
        notificationSuccess('加入房间成功', `房间id: ${roomId}`);
        return true;
      }
      // 服务器返回错误
      notificationError('加入失败', response.message || '加入房间失败');
      set({ joining: false });
      return false;
    } catch (error: any) {
      console.error('加入房间失败:', error);
      // 处理404房间不存在的情况
      if (error.response?.status === 404) {
        const errorMsg = error.response?.data?.message || '房间不存在';
        notificationError('加入失败', errorMsg);
      } else {
        const errorMsg = error.response?.data?.message || error.message || '网络错误，请稍后重试';
        notificationError('加入失败', errorMsg);
      }
      set({ joining: false });
      return false;
    }
  },

  reJoinRoom: () => {
    const { lastRoomId } = get();
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('clientToken') || '';
        const cid = localStorage.getItem('clientId') || '';
        set({ 
            clientToken: token, 
            clientId: cid 
        });
    }
    if (lastRoomId) {
      set({ curRoomId: lastRoomId, rejoining: true });
    }
  },

  startHeartbeat: () => {
    const { stopHeartbeat, ws } = get();
    stopHeartbeat();
    
    const interval = setInterval(() => {
        const { ws: currentWs } = get();
        if (currentWs && currentWs.readyState === WebSocket.OPEN) {
            currentWs.send(JSON.stringify({
                event: 'im-ping',
                type: 'im-ping',
                data: 'im-ping'
            }));
            console.log('心跳包已发送');
        }
    }, 30000); // 30s
    
    set({ heartbeatInterval: interval });
  },

  stopHeartbeat: () => {
    const { heartbeatInterval } = get();
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        set({ heartbeatInterval: null });
        console.log('心跳包已停止');
    }
  },

  connect: (roomId: string) => {
    const { ws, disconnect, clientToken, startHeartbeat, stopHeartbeat } = get();

    // 如果已有连接，先断开
    if (ws) {
      disconnect();
    }

    set({ connectionStatus: 'connecting', statusText: getStatusText('connecting') });
    const { error: notificationError, success: notificationSuccess } = useNotificationStore.getState();
    
    // 使用环境变量或配置的WebSocket URL
    const baseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL;
    if (!baseUrl) {
      console.error('WebSocket基础URL未配置');
      notificationError('连接失败', 'WebSocket基础URL未配置');
      return;
    }
    const wsUrl = `${baseUrl}/connect?roomId=${roomId}`;
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      // 发送认证请求
      console.log('WebSocket Open, sending auth req with token:', clientToken);
      newWs.send(JSON.stringify({ event: 'im-auth-req', data: clientToken }));
      startHeartbeat();
    };

    newWs.onmessage = (event) => {
      try {
        const obj = JSON.parse(event.data);
        console.log('收到WS消息:', obj);

        if (obj.event === 'im-message') {
             // 处理消息
             const msgData = obj;
             let message: Message;

             if (msgData.type === 'text') {
                 message = {
                     id: Date.now().toString() + Math.random(),
                     content: msgData.data,
                     sendBySelf: false,
                     type: 'text',
                     timestamp: Date.now()
                 };
                 get().addMessage(message);
             } else if (msgData.type === 'file') {
                 try {
                     const fileData = JSON.parse(msgData.data);
                     message = {
                         id: Date.now().toString() + Math.random(),
                         content: fileData.name || '文件',
                         sendBySelf: false,
                         type: 'file',
                         fileInfo: {
                             key: fileData.key,
                             name: fileData.name,
                             size: fileData.size
                         },
                         timestamp: Date.now()
                     };
                     get().addMessage(message);
                 } catch (e) {
                     console.error('解析文件消息失败', e);
                 }
             }
        } else if (obj.event === 'im-auth-resp') {
            notificationSuccess('连接成功', 'WebSocket连接成功');
            set({
                connectionStatus: 'connected',
                statusText: getStatusText('connected'),
                retryCount: 1,
                needReconnect: true,
                creating: false,
                joining: false,
                rejoining: false
            });
        } else if (obj.event === 'im-error') {
            notificationError('错误', obj.data);
        } else if (obj.event === 'im-close') {
            notificationError('连接失败', obj.data);
            set({
                connectionStatus: 'connect-fail',
                statusText: getStatusText('connect-fail'),
                needReconnect: false,
                dialogVisible: true
            });
            newWs.close();
        }

      } catch (error) {
        console.error('解析消息失败:', error);
      }
    };

    // 重连逻辑处理
    const handleReconnect = () => {
        const { needReconnect, retryCount, curRoomId, connect } = get();
        stopHeartbeat();
        
        console.log('连接中断, needReconnect:', needReconnect, 'retryCount:', retryCount);

        if (needReconnect === false || retryCount > 4 || curRoomId === "") {
            set({
                dialogVisible: true,
                connectionStatus: 'connect-fail',
                statusText: getStatusText('connect-fail'),
                joining: false, // reset flags
                rejoining: false,
                creating: false
            });
            // Don't set ws to null here, just let it close
        } else {
            notificationError('连接中断', `连接中断，正在进行第${retryCount}次重连`);
            set({
                connectionStatus: 'connect-interupt',
                statusText: getStatusText('connect-interupt', retryCount),
                retryCount: retryCount + 1
            });
            
            // 延迟重连
            setTimeout(() => {
                connect(curRoomId);
            }, 1000);
        }
    };

    newWs.onerror = (error) => {
      console.error('WebSocket错误:', error);
      handleReconnect();
    };

    newWs.onclose = () => {
      console.log('WebSocket Closed');
      // 只有在非正常关闭且需要重连时才重连
      // 如果是我们主动调用disconnect()，通常会先设置needReconnect或者外部控制
      // 这里简化判断，直接调用reconnect logic check
      handleReconnect();
    };

    set({ ws: newWs });
  },

  disconnect: () => {
    const { ws, stopHeartbeat } = get();
    stopHeartbeat();
    if (ws) {
        // 防止触发onclose重连
        set({ needReconnect: false }); 
        ws.close();
        set({ ws: null, connectionStatus: 'not-connected', statusText: getStatusText('not-connected') });
    }
  },

  sendMessage: (content: string) => {
    const { ws, connectionStatus } = get();

    if (connectionStatus !== 'connected' || !ws) {
      useNotificationStore.getState().error('发送失败', 'WebSocket连接未建立');
      return false;
    }

    const payload = {
        event: 'im-message',
        type: 'text',
        data: content
    };

    ws.send(JSON.stringify(payload));

    // 添加到本地消息列表
    const message: Message = {
      id: Date.now().toString() + Math.random(),
      content,
      sendBySelf: true,
      type: 'text',
      timestamp: Date.now()
    };
    get().addMessage(message);

    return true;
  },

  sendFileMessage: (fileInfo: { key: string; name: string; size: number }) => {
    const { ws, connectionStatus } = get();

    if (connectionStatus !== 'connected' || !ws) {
      useNotificationStore.getState().error('发送失败', 'WebSocket连接未建立');
      return false;
    }

    const fileData = {
        key: fileInfo.key,
        name: fileInfo.name,
        size: fileInfo.size
    };
    
    // Vue实现里的格式: data是stringify后的fileData
    const payload = {
        event: 'im-message',
        type: 'file',
        data: JSON.stringify(fileData)
    };

    ws.send(JSON.stringify(payload));

    // 添加到本地消息列表
    const message: Message = {
      id: Date.now().toString() + Math.random(),
      content: fileInfo.name,
      sendBySelf: true,
      type: 'file',
      fileInfo: fileInfo,
      timestamp: Date.now()
    };
    get().addMessage(message);

    return true;
  },

  addMessage: (msg) => {
    set((state) => ({
      messages: [...state.messages, msg]
    }));
  },

  setConnectionStatus: (status) => {
    const { retryCount } = get();
    set({
      connectionStatus: status,
      statusText: getStatusText(status, retryCount)
    });
  },

  setDialogVisible: (visible) => {
    set({ dialogVisible: visible });
  }
}));
