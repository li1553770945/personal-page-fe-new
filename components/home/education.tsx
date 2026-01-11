"use client"

import { useTranslation } from 'react-i18next'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { GraduationCap, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'

export default function Education() {
    const { t } = useTranslation()
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: false, amount: 0.2 })
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

    const educationItems = t('education.items', { returnObjects: true }) as Array<{
        period: string
        school: string
        college: string
        degree: string
        major: string
        courses: Array<{ name: string; score: string }>
        honors: string[]
    }>

    // 根据学校名称获取校徽路径
    const getSchoolLogo = (schoolName: string): string | null => {
        const logoMap: Record<string, string> = {
            '东南大学': '/schools/seu.svg',
            'Southeast University': '/schools/seu.svg',
            '南京航空航天大学': '/schools/nuaa.svg',
            'Nanjing University of Aeronautics and Astronautics': '/schools/nuaa.svg',
        }
        return logoMap[schoolName] || null
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
                {t('education.title')}
            </motion.h2>

            <div className="relative">
                {/* 时间线 */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-sky-500/15 hidden md:block" />

                <div className="space-y-6">
                    {educationItems.map((item, index) => {
                        const isExpanded = expandedItems.has(index)
                        const hasDetails = (item.courses && item.courses.length > 0) || (item.honors && item.honors.length > 0)

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* 时间线节点 */}
                                <div className="absolute left-4 md:left-6 top-3 w-3 h-3 rounded-full bg-sky-500 border-2 border-background shadow-sm hidden md:block" />

                                {/* 卡片内容 */}
                                <div className="ml-0 md:ml-12">
                                    <div
                                        className="relative overflow-hidden rounded-xl border border-sky-500/15 bg-white/90 dark:bg-neutral-900/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur cursor-pointer"
                                        role={hasDetails ? 'button' : undefined}
                                        tabIndex={hasDetails ? 0 : -1}
                                        onClick={hasDetails ? () => toggleExpand(index) : undefined}
                                        onKeyDown={hasDetails ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(index) } } : undefined}
                                    >
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-400/8 via-transparent to-sky-400/8" />
                                        <div className="pointer-events-none absolute -left-10 -top-12 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />

                                        <div className="relative p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    {getSchoolLogo(item.school) ? (
                                                        <div className="p-2 rounded-xl shrink-0 bg-white/85 dark:bg-neutral-800/80 border border-sky-500/15 shadow-sm flex items-center justify-center">
                                                            <Image
                                                                src={getSchoolLogo(item.school)!}
                                                                alt={item.school}
                                                                width={32}
                                                                height={32}
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 shrink-0 border border-sky-500/20">
                                                            <GraduationCap className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-lg font-semibold text-foreground">
                                                                {item.school}
                                                            </h3>
                                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-200 border border-sky-500/20">
                                                                {item.period}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-0.5">
                                                            {item.college} · {item.degree} · {item.major}
                                                        </p>
                                                    </div>
                                                </div>
                                                {hasDetails && (
                                                    <button
                                                        onClick={() => toggleExpand(index)}
                                                        className="shrink-0 p-2.5 rounded-full border border-border/70 hover:border-sky-500/60 hover:bg-sky-500/10 transition-colors text-muted-foreground hover:text-foreground"
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
                                                {isExpanded && hasDetails && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-4 pt-4 border-t border-border/60 space-y-4">
                                                            {/* 主修课程 */}
                                                            {item.courses && item.courses.length > 0 && (
                                                                <div>
                                                                    <h4 className="text-xs font-semibold text-foreground mb-2">
                                                                        {t('education.courses')}
                                                                    </h4>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {item.courses.map((course, courseIndex) => (
                                                                            <span
                                                                                key={courseIndex}
                                                                                className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                                                                            >
                                                                                {course.name}
                                                                                {course.score && (
                                                                                    <span className="ml-1 text-primary font-medium">
                                                                                        ({course.score})
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* 荣誉奖项 */}
                                                            {item.honors && item.honors.length > 0 && (
                                                                <div>
                                                                    <h4 className="text-xs font-semibold text-foreground mb-2">
                                                                        {t('education.honors')}
                                                                    </h4>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {item.honors.map((honor, honorIndex) => (
                                                                            <span
                                                                                key={honorIndex}
                                                                                className="text-xs px-2 py-1 bg-sky-500/10 text-sky-700 dark:text-sky-200 rounded-md font-medium border border-sky-500/20"
                                                                            >
                                                                                {honor}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
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
