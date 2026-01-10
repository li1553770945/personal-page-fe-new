"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, X, Eraser, User } from 'lucide-react'
import { aiChatAPI, AIChatRequest } from '@/api'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { useLive2D } from '@/context/live2d'
import { getMotionStrategy } from './utils'
import { MessageParser } from './message-parser'
import { ShineBorder } from "@/components/ui/shine-border"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription, // 必须引入这个
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  isUser: boolean
}

interface WorkflowStatus {
  isActive: boolean
  currentNode: string | null
  nodeTitle: string | null
}

export default function ChatDialog() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState('')
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>({
    isActive: false,
    currentNode: null,
    nodeTitle: null
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageParserRef = useRef<MessageParser>(new MessageParser())
  const { openChatDialog, setOpenChatDialog, slideIn, playMotion, setExpression } = useLive2D()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
  if (!openChatDialog) {
    // 关闭时切回普通表情
    setExpression("normal") // 或者 "joy"
  }
}, [openChatDialog, setExpression])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([])
    setConversationId('')
    messageParserRef.current.clear()
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      isUser: true
    };

    const aiMessageId = crypto.randomUUID();
    const aiPlaceholder: Message = {
      id: aiMessageId,
      text: '',
      isUser: false
    };

    setMessages(prev => [...prev, userMessage, aiPlaceholder]);
    setInput('');
    setIsLoading(true);

    // 为新消息重置解析器
    messageParserRef.current.clear();
    let accumulatedText = '';
    const request: AIChatRequest = { message: userMessage.text };
    if (conversationId !== "") request.conversation_id = conversationId;

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
            // 使用消息解析器处理包含感情控制块的消息
            const parseResult = messageParserRef.current.parse(chunk.data);
            
            // 累积显示文本
            accumulatedText += parseResult.displayText;
            
            // 处理检测到的emotion
            parseResult.emotions.forEach(emotion => {
              handleMotion(emotion);
            });
            
            // 更新消息
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].text = accumulatedText;
              return newMessages;
            });
            break;
          case 'motion':
            handleMotion(chunk.data)
            break;
          case 'workflowStarted':
          case 'workflow_started':
            try {
              const parsedData = typeof chunk.data === 'string' ? JSON.parse(chunk.data) : chunk.data;
              console.log('工作流开始:', parsedData);
              setWorkflowStatus({
                isActive: true,
                currentNode: null,
                nodeTitle: t('chatDialog.workflowStarted')
              });
            } catch (e) {
              console.error('解析workflowStarted失败:', e);
            }
            break;
          case 'nodeStarted':
          case 'node_started':
            try {
              const parsedData = typeof chunk.data === 'string' ? JSON.parse(chunk.data) : chunk.data;
              const nodeType = parsedData.node_type;
              const nodeTitle = parsedData.title;
              console.log('节点开始:', nodeType, nodeTitle);
              let displayTitle = nodeTitle;
              
              // 根据节点类型设置显示文本
              switch (nodeType) {
                case 'question-classifier':
                  displayTitle = t('chatDialog.intentRecognition');
                  break;
                case 'knowledge-retrieval':
                  displayTitle = t('chatDialog.knowledgeRetrieval');
                  break;
                case 'llm':
                  displayTitle = t('chatDialog.llmProcessing');
                  break;
                case 'start':
                  displayTitle = t('chatDialog.processingInput');
                  break;
                default:
                  displayTitle = nodeTitle || t('chatDialog.processing');
              }
              
              setWorkflowStatus({
                isActive: true,
                currentNode: nodeType,
                nodeTitle: displayTitle
              });
            } catch (e) {
              console.error('解析nodeStarted失败:', e);
            }
            break;
          case 'nodeFinished':
          case 'node_finished':
            // 节点完成后可以选择保持状态一小段时间或立即清除
            // 这里暂时不做处理，等待下一个节点或workflow结束
            break;
          case 'workflowFinished':
          case 'workflow_finished':
          case 'error':
            // 工作流结束，清除状态
            setWorkflowStatus({
              isActive: false,
              currentNode: null,
              nodeTitle: null
            });
            break;
          case 'messageEnd':
            // 可选处理：消息结束时的动作
            break;
          default:
            console.warn(`未知的事件类型: ${chunk.event_type}`);
            break;
        }
      },
      onFinished: () => {
        // 处理缓存中可能残留的不完整控制块
        const remaining = messageParserRef.current.finalize();
        if (remaining.length > 0) {
          accumulatedText += remaining;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = accumulatedText;
            return newMessages;
          });
        }
        
        setIsLoading(false);
        setWorkflowStatus({
          isActive: false,
          currentNode: null,
          nodeTitle: null
        });
      },
      onError: (error) => {
        console.error('Chat error:', error);
        const fallback = t('chatDialog.errorMessage') || "Error";
        const finalText = error?.message ? `${fallback}: ${error.message}` : fallback;
        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: finalText } : msg
        ));
        setIsLoading(false);
      }
    });
  };
  const handleSparklesClick = () => {
    setOpenChatDialog(true)
    slideIn()
  }
  const handleMotion = (motion: string) => {
    const strategy = getMotionStrategy(motion)
    playMotion(strategy.group, strategy.index)
    setExpression(strategy.expression)
  }
  return (
    <>
      {/* 固定的浮动聊天按钮 */}
      <button
        onClick={() => handleSparklesClick()}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[4000] p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        title={t('chatDialog.title')}
      >
        <Sparkles className="w-6 h-6 animate-spin-slow" />
      </button>

      <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog} modal={false}>
        <DialogContent
          className="fixed z-50 gap-0 p-0 outline-none
                     right-4 bottom-20 sm:right-[300px] sm:bottom-40 
                     w-[90vw] sm:w-[400px] h-[600px] max-h-[70vh]
                     top-auto left-auto translate-x-0 translate-y-0
                     border-none shadow-2xl 
                     [&>button]:hidden" // 隐藏 Shadcn 默认的关闭按钮
        >
          <DialogDescription className="hidden">
            {t('chatDialog.title')}
          </DialogDescription>
          <ShineBorder
            className="flex flex-col h-full w-full border bg-background/95 backdrop-blur-md overflow-hidden relative"
            // borderRadius={16}
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >

            {/* 【关键修复】
              增加一个 div 容器，强制 z-index 为 10，防止被 ShineBorder 的光效层遮挡。
              同时设置 relative 确保层级生效。
            */}
            <div className="flex flex-col h-full w-full relative z-[100]">

              {/* Header */}
              <div className="px-4 py-3 border-b border-border/50 flex flex-row items-center justify-between bg-muted/20 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-full">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-medium">{t('chatDialog.assistantTitle')}</DialogTitle>
                    <p className="text-[10px] text-muted-foreground font-normal">{t('chatDialog.basedOnLLMTech')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handleClear} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground" title={t('chatDialog.clearChat')}>
                    <Eraser className="w-4 h-4" />
                  </button>
                  <DialogClose className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-muted-foreground">
                    <X className="w-4 h-4" />
                  </DialogClose>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                    <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-2">
                      <Sparkles className="h-8 w-8 text-primary/40" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-medium text-sm">{t('chatDialog.welcomeQuestion')}</p>
                      <p className="text-xs opacity-70">{t('chatDialog.welcomeDesc')}</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 w-full",
                        message.isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      {!message.isUser && (
                        <Avatar className="h-8 w-8 mt-1 border border-border/50">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs"><Bot size={14} /></AvatarFallback>
                        </Avatar>
                      )}

                      <div className={cn(
                        "flex flex-col max-w-[80%]",
                        message.isUser ? "items-end" : "items-start"
                      )}>
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                            message.isUser
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted/80 text-foreground border border-border/50 rounded-tl-sm backdrop-blur-sm"
                          )}
                        >
                          {(!message.isUser && message.text === '' && isLoading) ? (
                            <div className="flex flex-col gap-2">
                              {workflowStatus.isActive && workflowStatus.nodeTitle && (
                                <div className="text-xs text-muted-foreground/80 flex items-center gap-2 mb-1">
                                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  <span>{workflowStatus.nodeTitle}</span>
                                </div>
                              )}
                              <div className="flex gap-1 py-1 h-5 items-center">
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                              </div>
                            </div>
                          ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                              <ReactMarkdown
                                components={{
                                  p: ({ ...props }) => <p {...props} className="m-0 break-words" />,
                                  a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline" />,
                                  code: ({ ...props }) => {
                                    // @ts-expect-error - ReactMarkdown types don't include inline property
                                    const inline = props.inline
                                    return inline
                                      ? <code {...props} className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-xs" />
                                      : <code {...props} className="block bg-black/10 dark:bg-white/10 p-2 rounded-lg font-mono text-xs overflow-x-auto my-2" />
                                  }
                                }}
                              >
                                {message.text}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>

                      {message.isUser && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-slate-200 text-slate-600"><User size={14} /></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-background/50 backdrop-blur-sm border-t border-border/50 shrink-0">
                <div className="relative flex items-center bg-muted/50 rounded-full border border-border/50 focus-within:border-primary/50 focus-within:bg-background transition-all shadow-sm">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chatDialog.inputPlaceholder')}
                    disabled={isLoading}
                    className="flex-1 min-h-[44px] max-h-[120px] py-3 pl-4 pr-10 bg-transparent resize-none text-sm focus:outline-none scrollbar-hide"
                    rows={1}
                    style={{ height: '44px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={cn(
                      "absolute right-1.5 p-2 rounded-full transition-all duration-200",
                      (input.trim() && !isLoading)
                        ? "bg-primary text-primary-foreground hover:scale-105 shadow-md"
                        : "bg-transparent text-muted-foreground cursor-not-allowed opacity-50"
                    )}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="text-[10px] text-center text-muted-foreground/40 mt-2">
                  {t('chatDialog.aiDisclaimer')}
                </div>
              </div>

            </div>
          </ShineBorder>
        </DialogContent>
      </Dialog>
    </>
  );
}