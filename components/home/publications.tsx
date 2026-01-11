"use client"

import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

type PublicationItem = {
  title: string
  authors: string[]
  journal: string
  year: string
  volume?: string
  issue?: string
  articleNo?: string
  pages?: string
  type: string
}

export function Publications() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  
  const rawItems = t('publications.items', { returnObjects: true })
  const publicationItems = (Array.isArray(rawItems) ? rawItems : []) as PublicationItem[]

  const formatAuthors = (authors: string[]) => {
    if (!authors || !Array.isArray(authors)) return null
    return authors.map((author, index) => {
      const isMe = author.trim() === "Yaning Li"
      return (
        <span key={index}>
          {isMe ? <strong className="text-foreground font-semibold">{author}</strong> : author}
          {index < authors.length - 1 ? ", " : ""}
        </span>
      )
    })
  }

  return (
    <div ref={containerRef} className="w-full py-12">
        <motion.div
           initial={{ opacity: 0, y: 12 }}
           animate={isInView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.45 }}
           className="mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            {t('publications.title')}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
           {publicationItems.map((item, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, x: -20 }}
                   animate={isInView ? { opacity: 1, x: 0 } : {}}
               transition={{ duration: 0.3, delay: index * 0.1 }}
               className="group relative pl-4 border-l-2 border-muted hover:border-primary transition-colors duration-300"
             >
                <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                        </h3>
                        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-secondary text-secondary-foreground">
                            {item.type}
                        </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground/80 leading-relaxed font-light">
                        <span className="mr-2">{formatAuthors(item.authors)}</span>
                        <span>
                            — <span className="italic">{item.journal}</span>, {item.year}
                        </span>
                    </div>
                </div>
             </motion.div>
           ))}
        </div>
    </div>
  )
}
