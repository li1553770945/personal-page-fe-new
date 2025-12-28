"use client"

import { useTranslation } from 'react-i18next'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
export default function Experience() {
    const { t } = useTranslation()
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

    const experienceItems = t('experience.items', { returnObjects: true }) as Array<{
        period: string
        company: string
        department: string
        type: string
        position: string
        description: string
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
            {/* motion 当用户滚动页面，直到这个组件进入视野 20% 时，标题会从下方淡入并向上浮动显示。 */}
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
                <div className="absolute right-6 md:right-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

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
                                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                        {/* 主要信息 - 紧凑的两行布局 */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                {getCompanyLogo(item.company) ? (
                                                    <div className="p-1.5 rounded-md shrink-0 flex items-center justify-center">
                                                        <Image
                                                            src={getCompanyLogo(item.company)!}
                                                            alt={item.company}
                                                            width={32}
                                                            height={32}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                                                        <Briefcase className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-lg font-semibold text-foreground">
                                                            {item.company}
                                                        </h3>
                                                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md font-medium">
                                                            {item.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.department} · {item.position}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground font-medium">
                                                            {item.period}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {hasDescription && (
                                                <button
                                                    onClick={() => toggleExpand(index)}
                                                    className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                                    aria-label={isExpanded ? '收起' : '展开'}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* 可展开的详细描述 */}
                                        <AnimatePresence>
                                            {isExpanded && hasDescription && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 pt-4 border-t border-border">
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
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

