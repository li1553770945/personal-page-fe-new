"use client"

import { useTranslation } from 'react-i18next'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
export default function Experience() {
    const { t } = useTranslation()
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: false, amount: 0.2 })
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

    const experienceItems = t('experience.items', { returnObjects: true }) as Array<{
        period: string
        company: string
        department: string
        type: string
        position: string
        description: string[]
    }>

    const getCompanyLogo = (companyName: string): string | null => {
        const logoMap: Record<string, string> = {
            '阿里巴巴': '/companies/alibaba.svg',
            '字节跳动': '/companies/bytedance.svg',
            '腾讯': '/companies/tencent.svg',
            'Alibaba': '/companies/alibaba.svg',
            'ByteDance': '/companies/bytedance.svg',
            'Tencent': '/companies/tencent.svg',
        }
        return logoMap[companyName] || null
    }

    // 解析描述文本，将 **text** 渲染为加粗高亮样式
    const renderDescription = (text: string) => {
        // 使用正则分割字符串，保留 **...** 部分
        const parts = text.split(/(\*\*.*?\*\*)/g)
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // 去除 ** 标记并应用样式
                return (
                    <span key={index} className="font-bold text-primary/90 mx-0.5">
                        {part.slice(2, -2)}
                    </span>
                )
            }
            return <span key={index}>{part}</span>
        })
    }

    const toggleExpand = (index: number) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev)
            if (newSet.has(index)) {
                newSet.delete(index)
            } else {
                newSet.add(index)
            }
            return newSet
        })
    }

    return (
        <div ref={containerRef} className="w-full py-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-6 text-foreground"
            >
                {t('experience.title')}
            </motion.h2>

            <div className="relative">
                {/* 时间线 - 右侧对齐，与教育经历区分 */}
                <div className="absolute right-6 md:right-8 top-0 bottom-0 w-0.5 bg-indigo-500/20 hidden md:block" />

                <div className="space-y-6">
                    {experienceItems.map((item, index) => {
                        const isExpanded = expandedItems.has(index)
                        const hasDescription = item.description && item.description.length > 0

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* 时间线节点 - 右侧 */}
                                <div className="absolute right-4 md:right-6 top-3 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm hidden md:block" />

                                {/* 卡片内容 - 右侧对齐 */}
                                <div className="mr-0 md:mr-12">
                                    <div
                                        className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-white/95 dark:bg-neutral-900/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur cursor-pointer"
                                        role={hasDescription ? 'button' : undefined}
                                        tabIndex={hasDescription ? 0 : -1}
                                        onClick={hasDescription ? () => toggleExpand(index) : undefined}
                                        onKeyDown={hasDescription ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(index) } } : undefined}
                                    >
                                        <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500/50" />

                                        <div className="relative p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    {getCompanyLogo(item.company) ? (
                                                        <div className="p-2 rounded-xl shrink-0 bg-white/85 dark:bg-neutral-800/85 border border-indigo-500/15 shadow-sm flex items-center justify-center">
                                                            <Image
                                                                src={getCompanyLogo(item.company)!}
                                                                alt={item.company}
                                                                width={32}
                                                                height={32}
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 shrink-0 border border-indigo-500/20">
                                                            <Briefcase className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-lg font-semibold text-foreground">
                                                                {item.company}
                                                            </h3>
                                                            <span className="text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full font-medium border border-indigo-500/20">
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                                                            <p className="truncate">
                                                                {item.department} · {item.position}
                                                            </p>
                                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                                                                {item.period}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {hasDescription && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleExpand(index)
                                                        }}
                                                        className="shrink-0 p-2.5 rounded-full border border-border/70 hover:border-indigo-500/60 hover:bg-indigo-500/10 transition-colors text-muted-foreground hover:text-foreground"
                                                        aria-label={isExpanded ? '收起' : '展开'}
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            <AnimatePresence>
                                                {isExpanded && hasDescription && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-4 pt-4 border-t border-indigo-500/15">
                                                            <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
                                                                {item.description.map((desc, i) => (
                                                                    <li key={i}>{renderDescription(desc)}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

