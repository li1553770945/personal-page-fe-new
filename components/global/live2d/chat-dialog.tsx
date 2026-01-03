"use client"
import React, { useState, useRef, useEffect } from 'react'
import {  Send, MessageSquare } from 'lucide-react'
import { aiChatAPI, AIChatRequest } from '@/api'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { useLive2D } from '@/context/live2d'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Message {
  id: string
  text: string
  isUser: boolean
}


export default function ChatDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false) // 用于控制输入框和按钮的禁用状态
  const [conversationId, setConversationId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { say } = useLive2D()

  useEffect(() => {
    // 监听自定义事件打开对话框
    const handleOpenChatDialog = () => setOpen(true);
    window.addEventListener('openChatDialog', handleOpenChatDialog);
    return () => window.removeEventListener('openChatDialog', handleOpenChatDialog);
  }, []);
  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true
    };

   
    const aiMessageId = (Date.now() + 1).toString();
    const aiPlaceholder: Message = {
      id: aiMessageId,
      text: t('chatDialog.aiThinking'), // 初始显示提示文本
      isUser: false
    };

    setMessages(prev => [...prev, userMessage, aiPlaceholder]);
    setInput('');
    setIsLoading(true); // 禁用输入框和发送按钮

    // 用于累积流式文本的变量（避免闭包陷阱）
    let accumulatedText = '';
    const request: AIChatRequest = {
      message: userMessage.text,
    };
    if (conversationId != "") {
      request.conversationId = conversationId;
    }
    // 3. 调用 API
    await aiChatAPI(request, {
      onMessage: (chunk) => {
        switch (chunk.event_type) {
          case 'conversationId':
            setConversationId(chunk.data);
            break;
          case 'messageId':
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].id = chunk.data;
              return newMessages;
            });
            break;
          case 'message':
            accumulatedText += chunk.data;
            // 实时更新最后那条 AI 消息的内容
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].text = accumulatedText;
              return newMessages;
            });
            break;
          default:
            console.warn('Unknown event_type:', chunk.event_type);
            break;
        }

      },
      onFinished: () => {
        setIsLoading(false); // 启用输入框和发送按钮
      },
      onError: (error) => {
        console.error('Chat error:', error);
        // 更新AI消息为错误提示
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, text: t('chatDialog.errorMessage') }
              : msg
          )
        );
        setIsLoading(false); // 启用输入框和发送按钮
      }
    });
  };

  return (
    <div className="fixed bottom-20 right-20 z-50 w-full max-w-md">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl shadow-2xl border border-border bg-card text-card-foreground max-h-[70vh] flex flex-col overflow-hidden">
          <DialogHeader className="border-b border-border p-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              AI 助手
            </DialogTitle>
            <DialogClose className="rounded-full hover:bg-muted transition-colors">
            </DialogClose>
          </DialogHeader>
          
          {/* 聊天消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                <p>开始与 AI 助手聊天吧</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${message.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'}`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ ...props }) => <p {...props} className="mb-0" />,
                          code: ({ ...props }) => (
                            <code {...props} className="bg-muted-foreground/20 px-1 py-0.5 rounded text-sm" />
                          ),
                          pre: ({ children, ...props }) => (
                            <pre {...props} className="bg-muted-foreground/10 p-2 rounded overflow-x-auto">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ ...props }) => (
                            <blockquote {...props} className="border-l-2 border-primary pl-3 italic my-0" />
                          ),
                          ul: ({ ...props }) => <ul {...props} className="my-0 pl-5" />,
                          ol: ({ ...props }) => <ol {...props} className="my-0 pl-5" />,
                          li: ({ ...props }) => <li {...props} className="mb-1" />,
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* 输入区域 */}
          <div className="border-t border-border p-4">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                disabled={isLoading}
                className="flex-1 min-h-[60px] max-h-[120px] resize-none rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-primary text-primary-foreground p-3 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}