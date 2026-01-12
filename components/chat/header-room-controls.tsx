"use client"

import { useState, ReactNode } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderRoomControlsProps {
  actions?: ReactNode;
}

export default function HeaderRoomControls({ actions }: HeaderRoomControlsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const {
    curRoomId,
    clientId,
    inputRoomId,
    connectionStatus,
    statusText,
    dialogVisible,
    creating,
    joining,
    rejoining,
    lastRoomId,
    setInputRoomId,
    createRoom,
    joinRoom,
    reJoinRoom,
    connect,
    setDialogVisible
  } = useChatStore();
  
  const handleCreateAndConnect = async () => {
    const result = await createRoom();
    if (result) {
      // 从store中获取最新的curRoomId
      const roomId = useChatStore.getState().curRoomId;
      if (roomId) {
        connect(roomId);
      }
    }
  };
  
  const handleJoinAndConnect = async () => {
    if (!inputRoomId.trim()) return;
    const result = await joinRoom(inputRoomId);
    if (result) {
      connect(inputRoomId);
    }
  };
  
  const handleReJoinAndConnect = () => {
    reJoinRoom();
    if (lastRoomId) {
      connect(lastRoomId);
    }
  };
  
  // 状态栏样式
  const getStatusBarClass = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500 text-white';
      case 'connecting':
        return 'bg-blue-500 text-white';
      case 'not-connected':
      case 'connect-fail':
      case 'connect-interupt':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <div className="w-full space-y-2">
      {/* 状态栏 */}
      <div className={`h-8 flex items-center justify-center text-xs font-medium rounded-lg ${getStatusBarClass()}`}>
        <span>{t(`chat.status.${connectionStatus}`) || statusText}</span>
      </div>
      
      {/* 连接成功时的信息展示 */}
      {connectionStatus === 'connected' && (
        <Card className="p-2">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-6 flex-wrap flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">
                  {t('chat.roomId')}:
                </span>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {curRoomId}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">
                  {t('chat.clientId')}:
                </span>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {clientId}
                </code>
              </div>
            </div>
            {actions}
          </div>
        </Card>
      )}
      
      {/* 未连接时的操作区域 */}
      {connectionStatus !== 'connected' && (
        <Card className="p-2">
          <div className="flex gap-2 flex-wrap items-center">
            <Button
              onClick={handleCreateAndConnect}
              disabled={connectionStatus === 'connecting'}
              loading={creating}
            >
              {t('chat.createRoom')}
            </Button>
            
            <div className="flex gap-2 flex-1 min-w-[300px]">
              <Input
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
                placeholder={t('chat.enterRoomId')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleJoinAndConnect();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={handleJoinAndConnect}
                disabled={connectionStatus === 'connecting' || !inputRoomId.trim()}
                loading={joining}
              >
                {t('chat.join')}
              </Button>
            </div>
            
            {lastRoomId && (
              <Button
                onClick={handleReJoinAndConnect}
                disabled={connectionStatus === 'connecting'}
                loading={rejoining}
                variant="outline"
              >
                {t('chat.rejoin')}
              </Button>
            )}
          </div>
        </Card>
      )}
      
      {/* 连接失败对话框 */}
      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('chat.connectionFailedTitle')}</DialogTitle>
            <DialogDescription>
              {t('chat.connectionFailedMessage')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogVisible(false)}>
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
