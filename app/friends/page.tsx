"use client"

import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect } from "react"
import { useLive2D } from "@/context/live2d"
interface Friend {
  name: string
  description: string
  href: string
  avatar: string
  bgColor?: string
  titleColor?: string
  descColor?: string
}

const friends: Friend[] = [
  {
    name: "kirigaya",
    description: "AI大佬，能手搓神经网络计算框架",
    href: "https://kirigaya.cn/",
    avatar: "http://img.peacesheep.xyz/20231118152330.png", // 示例头像
    bgColor: "#FFA500", // Orange
    titleColor: "#003366", // Dark Blue
    descColor: "#333333"
  },
  {
    name: "qianpinyi",
    description: "底层大佬，能手搓资源管理器",
    href: "https://github.com/qianpinyi",
    avatar: "http://img.peacesheep.xyz/20231118152202.png",
    bgColor: "#758a75", // Muted Green
    titleColor: "#ffffff",
    descColor: "#e0e0e0"
  },
  {
    name: "Temperance-XIV",
    description: "数学大佬，能手推世间一切数学公式",
    href: "https://scholar.google.com/citations?user=HepdygEAAAAJ&hl=en",
    avatar: "http://img.peacesheep.xyz/20231118152450.png",
    bgColor: "#dbeafe", // Light Blue
    titleColor: "#1e40af", // Blue-800
    descColor: "#475569" // Slate-600
  },
  {
    name: "qrzbing",
    description: "一名兴趣使然，爱好杂而不精的安全研究员",
    href: "https://qrz.today/",
    avatar: "http://img.peacesheep.xyz/63a12427960ebff7062077a84c91ee18_1.jpg",
    bgColor: "#ffe4b5", // Moccasin
    titleColor: "#8b4513", // SaddleBrown
    descColor: "#696969" // DimGray
  },
  {
    name: "iswiftai",
    description: "时空图领域技术专家",
    href: "https://blog.iswiftai.com/",
    avatar: "https://img.peacesheep.xyz/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20241021222809.jpg",
    bgColor: "#add8e6", // LightBlue
    titleColor: "#000000",
    descColor: "#2f4f4f"
  },
  {
    name: "liquor",
    description: "懂得美食品鉴的后端技术探索者",
    href: "https://liquor07.xyz/",
    avatar: "https://img.peacesheep.xyz/2025/12/676eb090472bc77518a731b320e5ac03.png",
    bgColor: "#fff0f5", // LavenderBlush
    titleColor: "#800080", // Purple
    descColor: "#800080"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function FriendsPage() {
  const { t } = useTranslation()
  const live2d = useLive2D()
  
  useEffect(() => {
    if (live2d) {
      live2d.say('这些都是很厉害的朋友~')
    }
  }, [live2d])
  return (
    <div className="container mx-auto py-12 px-4 min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t('friends.title')}</h1>
        <p className="text-muted-foreground text-lg">{t('friends.description')}</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {friends.map((friend) => (
          <motion.div key={friend.name} variants={item}>
            <Link href={friend.href} target="_blank" rel="noopener noreferrer">
              <Card 
                className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden hover:-translate-y-1 border-0"
                style={{ backgroundColor: friend.bgColor }}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12 border-2 border-transparent bg-white/20 transition-colors">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback className="bg-white/50 text-black/70">{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <CardTitle 
                    className="text-xl transition-colors"
                    style={{ color: friend.titleColor }}
                  >
                    {friend.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription 
                    className="text-base line-clamp-2"
                    style={{ color: friend.descColor }}
                  >
                    {friend.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
