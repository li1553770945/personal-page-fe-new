"use client"

import { useState, useRef, KeyboardEvent } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { FileUp, X, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadFileAPI } from '@/api';
import axios from 'axios';

export default function MessageInput() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { sendMessage, sendFileMessage } = useChatStore();
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSendFile = async () => {
    if (!selectedFile) {
      toast({
        title: t('chat.sendFailed'),
        description: t('chat.selectFileFirst'),
        variant: 'destructive',
      });
      return;
    }
    
    setUploading(true);
    const fileName = selectedFile.name;
    
    try {
      // 1. 获取上传URL
      const uploadResponse = await uploadFileAPI({
        name: fileName,
        key: '',
        maxDownload: 0,
      });
      
      if (uploadResponse.code !== 0) {
        throw new Error(uploadResponse.message || t('chat.getUploadUrlFailed'));
      }
      const { signedUrl, key } = uploadResponse.data;
      
      // 2. 上传文件
      await axios.put(signedUrl, selectedFile, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Accept': '*/*',
          'Connection': 'keep-alive',
        },
      });
      
      // 3. 发送文件消息
      const result = sendFileMessage({
        key,
        name: fileName,
        size: selectedFile.size,
      });
      
      if (result) {
        toast({
          title: t('chat.sendSuccess'),
          description: `${t('chat.file')} ${fileName} ${t('chat.sent')}`,
        });
        clearFile();
      }
    } catch (error: any) {
      toast({
        title: t('chat.sendFailed'),
        description: error.message || t('chat.uploadFailed'),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const result = sendMessage(inputMessage);
      if (result) {
        setInputMessage('');
      }
    } else if (selectedFile) {
      handleSendFile();
    } else {
      toast({
        title: t('chat.sendFailed'),
        description: t('chat.messageEmpty'),
        variant: 'destructive',
      });
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="p-2">
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => fileInputRef.current?.click()}
          type="button"
          title={t('chat.selectFile')}
        >
          <FileUp className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {selectedFile && (
            <div className="flex items-center gap-2 bg-muted px-2 py-1.5 rounded-md text-xs">
              <span className="flex-1 truncate">
                {selectedFile.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 flex-shrink-0"
                onClick={clearFile}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.inputPlaceholder')}
            rows={1}
            className="resize-none min-h-[40px] max-h-[120px] py-3"
          />
        </div>
        
        <div className="shrink-0">
          <Button
            onClick={handleSendMessage}
            disabled={(!inputMessage.trim() && !selectedFile) || uploading}
            loading={uploading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
