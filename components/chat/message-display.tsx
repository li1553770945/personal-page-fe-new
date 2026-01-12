"use client"

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadFileAPI } from '@/api';

export default function MessageDisplay() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { messages } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  
  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  // 下载文件
  const handleDownloadFile = async (key: string, fileName: string) => {
    if (downloading[key]) return;
    setDownloading(prev => ({ ...prev, [key]: true }));
    try {
      const response = await downloadFileAPI(key);
      if (response.code !== 0) {
        throw new Error(response.message || t('chat.downloadFailed'));
      }
      const { signedUrl } = response.data;
      // 创建下载链接
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: t('chat.downloadStarted'),
        description: `${t('chat.downloading')} ${fileName}`,
      });
    } catch (error: any) {
      toast({
        title: t('chat.downloadFailed'),
        description: error.message || t('chat.downloadError'),
        variant: 'destructive',
      });
    } finally {
      setDownloading(prev => ({ ...prev, [key]: false }));
    }
  };
  
  return (
    <ScrollArea className="h-full border rounded-lg p-2 bg-background">
      <div ref={scrollRef} className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sendBySelf ? 'justify-end' : 'justify-start'}`}
          >
            {/* 文本消息 */}
            {(!msg.type || msg.type === 'text') && (
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 break-words ${
                  msg.sendBySelf
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-muted text-foreground rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            )}
            
            {/* 文件消息 */}
            {msg.type === 'file' && msg.fileInfo && (
              <div
                className={`max-w-[400px] min-w-[200px] rounded-lg p-3 ${
                  msg.sendBySelf
                    ? 'bg-blue-50 dark:bg-blue-950'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-primary">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm break-all mb-1">
                      {msg.fileInfo.name}
                    </div>
                    {msg.fileInfo.size && (
                      <div className="text-xs text-muted-foreground mb-2">
                        {formatFileSize(msg.fileInfo.size)}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleDownloadFile(msg.fileInfo!.key, msg.fileInfo!.name)}
                      disabled={downloading[msg.fileInfo.key]}
                      className="mt-1"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      {downloading[msg.fileInfo.key] 
                        ? t('chat.downloading') 
                        : t('chat.downloadFile')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
