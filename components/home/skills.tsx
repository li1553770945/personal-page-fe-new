import { IconCloud } from "@/components/ui/icon-cloud"
import { useTranslation } from 'react-i18next'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'

const slugs = [
    "typescript",
    "java",
    "html5",
    "nginx",
    "docker",
    "git",
    "github",
    "go",
    "c++",
    "opentelemetry",
    "python",
    "linux"
]

export function Skills() {
    const { t } = useTranslation()

    const images = slugs.map(
        (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
    )
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })


    return (
        <div ref={containerRef}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-6 text-foreground"
            >
                {t('skills.title')}
            </motion.h2>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative flex size-full items-center justify-center overflow-hidden"
            >
                <IconCloud images={images} />
            </motion.div>
        </div>

    )
}
