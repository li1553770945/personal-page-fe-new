"use client"

import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Trophy, Medal, Crown, Star } from 'lucide-react'

// 简化后的配色：不再改变背景色，只改变 Icon 和 Badge 的颜色
const awardStyleMap: Record<string, { icon: React.ReactNode; colorClass: string; gradient: string }> = {
    gold: {
        icon: <Trophy className="h-5 w-5" />,
        colorClass: "text-amber-500 dark:text-amber-400",
        gradient: "from-amber-500/10 to-transparent border-amber-500/20"
    },
    silver: {
        icon: <Medal className="h-5 w-5" />,
        colorClass: "text-slate-500 dark:text-slate-400",
        gradient: "from-slate-500/10 to-transparent border-slate-500/20"
    },
    bronze: {
        icon: <Medal className="h-5 w-5" />,
        colorClass: "text-orange-700 dark:text-orange-600",
        gradient: "from-orange-700/10 to-transparent border-orange-700/20"
    },
    special: {
        icon: <Crown className="h-5 w-5" />,
        colorClass: "text-emerald-500 dark:text-emerald-400",
        gradient: "from-emerald-500/10 to-transparent border-emerald-500/20"
    },
    default: {
        icon: <Star className="h-5 w-5" />,
        colorClass: "text-primary",
        gradient: "from-primary/10 to-transparent border-primary/20"
    }
}

type AwardItem = {
  name: string
  award: string
  tier?: 'gold' | 'silver' | 'bronze' | 'special'
  category?: string
}

export function Awards() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  const awardItems = t('awards.items', { returnObjects: true }) as AwardItem[]

  return (
    <div ref={containerRef} className="w-full py-12">
      {/* 标题区域 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
           {t('awards.title')}
        </h2>
      </motion.div>

      {/* 极简风 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {awardItems.map((item, index) => {
          const style = awardStyleMap[item.tier ?? 'default']

          return (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative"
            >
              <div 
                  className={`
                    relative h-full overflow-hidden rounded-xl border bg-white dark:bg-zinc-900/50 p-5
                    shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                    ${style.gradient.replace('from-', 'hover:border-')}
                  `}
              >
                {/* 顶部装饰条 */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${style.gradient}`} />
                
                <div className="flex flex-col h-full justify-between gap-4">
                    {/* Header: Icon + Category */}
                    <div className="flex items-start justify-between">
                         <div className={`p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 ${style.colorClass} saturate-100`}>
                            {style.icon}
                         </div>
                         {item.category && (
                             <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 border border-border px-2 py-1 rounded-full">
                                 {item.category}
                             </span>
                         )}
                    </div>

                    {/* Content: Title + Award */}
                    <div>
                        <h3 className="font-bold text-foreground text-sm md:text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                            {item.name}
                        </h3>
                        <div className={`text-xs font-semibold ${style.colorClass} flex items-center gap-1.5`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                            {item.award}
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
