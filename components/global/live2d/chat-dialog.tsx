"use client"
import React, { useState, useRef, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Send, MessageSquare } from 'lucide-react'
import { aiChatAPI, AIChatRequest } from '@/api'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'

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
    <div className="relative">
      {/* 聊天按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={t('chatDialog.openChat')}
      >
        <MessageSquare size={24} />
      </button>

      {/* 聊天对话框 */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed bottom-8 right-8 w-full max-w-md max-h-[80vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col z-[10000]">
            {/* 对话框头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('chatDialog.title')}
            </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  aria-label={t('chatDialog.closeDialog')}
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${message.isUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatDialog.inputPlaceholder')}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t('chatDialog.sendMessage')}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}