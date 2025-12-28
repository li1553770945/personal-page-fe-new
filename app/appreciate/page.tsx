"use client"

import { useTranslation } from "react-i18next"
import Image from "next/image"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BorderBeam } from "@/components/ui/border-beam"
import { TypingAnimation } from "@/components/ui/typing-animation"

export default function AppreciatePage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <TypingAnimation className="text-4xl font-bold mb-4">{t('appreciate.title')}</TypingAnimation>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('appreciate.description')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Alipay Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden h-full flex flex-col items-center text-center border-primary/10">
            <BorderBeam size={250} duration={12} delay={9} colorFrom="#1677ff" colorTo="#00b96b" />
            <CardContent className="flex-1 flex items-center justify-center p-6 pt-0">
              <div className="relative w-64 h-100 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image
                  src="/money/alipay.jpg"
                  alt="Alipay QR Code"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* WeChat Pay Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="relative overflow-hidden h-full flex flex-col items-center text-center border-primary/10">
            <BorderBeam size={250} duration={12} delay={9} colorFrom="#07c160" colorTo="#1677ff" />
            <CardContent className="flex-1 flex items-center justify-center p-6 pt-0">
              <div className="relative w-64 h-100 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image
                  src="/money/wechat.png"
                  alt="WeChat Pay QR Code"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
          {t('appreciate.thankYou')}
        </p>
      </motion.div>
    </div>
  )
}
