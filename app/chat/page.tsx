"use client"

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { useChatStore } from '@/store/chatStore';
import HeaderRoomControls from '@/components/chat/header-room-controls';
import MessageDisplay from '@/components/chat/message-display';
import MessageInput from '@/components/chat/message-input';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ChatPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const {
    curRoomId,
    connectionStatus,
    joinRoom,
    connect
  } = useChatStore();
  
  // 自动加入聊天室
  useEffect(() => {
    const chatId = searchParams.get('chatId');
    if (chatId && connectionStatus !== 'connected') {
      const autoJoinChat = async () => {
        const result = await joinRoom(chatId);
        if (result) {
          connect(chatId);
        }
      };
      autoJoinChat();
    }
  }, [searchParams]);
  
  // 分享聊天室
  const handleShare = async () => {
    const chatId = curRoomId || searchParams.get('chatId');
    if (!chatId) {
      toast({
        title: t('chat.shareFailed'),
        description: t('chat.noRoomToShare'),
        variant: 'destructive',
      });
      return;
    }
    
    const shareLink = `${window.location.origin}/chat?chatId=${chatId}`;
    
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: t('chat.shareSuccess'),
        description: t('chat.linkCopied'),
      });
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast({
          title: t('chat.shareSuccess'),
          description: t('chat.linkCopied'),
        });
      } catch (fallbackErr) {
        toast({
          title: t('chat.shareFailed'),
          description: t('chat.copyManually'),
          variant: 'destructive',
        });
      }
      
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-muted/10 p-4 box-border">
      <div className="w-full max-w-5xl h-full max-h-[85vh] flex flex-col gap-2 bg-background rounded-xl shadow-sm border p-3 overflow-hidden">
        {/* 房间控制 */}
        <HeaderRoomControls
          actions={
            curRoomId && connectionStatus === 'connected' ? (
              <Button onClick={handleShare} variant="default" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                {t('chat.shareRoom')}
              </Button>
            ) : undefined
          }
        />
        
        {/* 消息展示 */}
        <div className="flex-1 overflow-hidden min-h-0">
          <MessageDisplay />
        </div>
        
        {/* 消息输入 */}
        <div className="flex-shrink-0">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
