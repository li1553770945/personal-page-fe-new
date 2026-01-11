"use client"

import { IconCloud } from "@/components/ui/icon-cloud"
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import Image from "next/image"
// 技能数据配置
const javaIconUrl = `data:image/svg+xml;utf8,${encodeURIComponent('<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Java</title><path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639" fill="#5382a1"/></svg>')}`

const skills = [
    {
        name: "Linux",
        slug: "linux",
        level: "mastered",
        levelZh: "掌握"
    },

    {
        name: "C++",
        slug: "cplusplus",
        level: "mastered",
        levelZh: "掌握"
    },
    {
        name: "Git",
        slug: "git",
        level: "mastered",
        levelZh: "掌握"
    },
    {
        name: "Docker",
        slug: "docker",
        level: "mastered",
        levelZh: "掌握"
    },
    {
        name: "Golang",
        slug: "go",
        level: "skilled",
        levelZh: "熟练"
    },
    {
        name: "Python",
        slug: "python",
        level: "skilled",
        levelZh: "熟练"
    },
    {
        name: "Kubernetes",
        slug: "kubernetes",
        level: "skilled",
        levelZh: "熟练"
    },
    {
        name: "Vue",
        slug: "vuedotjs",
        level: "skilled",
        levelZh: "熟练"
    },
    {
        name: "TypeScript",
        slug: "typescript",
        level: "skilled",
        levelZh: "熟练"
    },
    {
        name: "Java",
        slug: "java",
        level: "familiar",
        levelZh: "熟悉",
        icon: javaIconUrl
    },
    {
        name: "CMake",
        slug: "cmake",
        level: "familiar",
        levelZh: "熟悉"
    },
    {
        name: "Lua",
        slug: "lua",
        level: "knowing",
        levelZh: "了解"
    }
]

// 熟练度映射 (1-4级)
const levelScore: Record<string, number> = {
    mastered: 4,
    skilled: 3,
    familiar: 2,
    knowing: 1
}

// 熟练度颜色映射 (用于进度条高亮)
const levelColor: Record<string, string> = {
    mastered: "bg-blue-500 dark:bg-blue-400",
    skilled: "bg-emerald-500 dark:bg-emerald-400",
    familiar: "bg-orange-500 dark:bg-orange-400",
    knowing: "bg-zinc-500 dark:bg-zinc-400"
}

export function Skills() {
    const { t } = useTranslation()
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: false, amount: 0.2 })

    // 生成 Cloud 需要的图片 URL
    const images = skills.map(
        (skill) => skill.icon || `https://cdn.simpleicons.org/${skill.slug}/${skill.slug}`
    )

    return (
        <div ref={containerRef} className="w-full py-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-6 text-foreground"
            >
                {t('skills.title')}
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* 左侧：技能列表墙 */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-4 order-2 lg:order-1"
                >
                    {skills.map((skill, index) => {
                        const score = levelScore[skill.level] || 1

                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-all hover:scale-105 hover:shadow-sm group backdrop-blur-sm"
                            >
                                <div className="w-9 h-9 mb-3 opacity-90 group-hover:opacity-100 transition-opacity">
                                    <Image
                                        src={skill.icon || `https://cdn.simpleicons.org/${skill.slug}/${skill.slug}`}
                                        alt={skill.name}
                                        className="w-full h-full object-contain"
                                        width={36}
                                        height={36}
                                    />
                                </div>
                                <span className="text-sm font-semibold mb-2 text-foreground/90">{skill.name}</span>

                                {/* 能量条组件 */}
                                <div className="flex flex-col items-center gap-1.5 w-full max-w-[80px]">
                                    <div className="flex gap-1 w-full justify-center">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 w-full rounded-full transition-colors duration-300 ${i <= score
                                                    ? levelColor[skill.level]
                                                    : "bg-muted/40"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/70 font-medium">
                                        {skill.levelZh}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </motion.div>

                {/* 右侧：3D 云 */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative flex items-center justify-center min-h-[300px] lg:min-h-[400px] order-1 lg:order-2"
                >
                    <IconCloud images={images} />
                </motion.div>
            </div>
        </div>
    )
}

