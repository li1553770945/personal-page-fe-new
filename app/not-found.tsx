"use client"
import Link from 'next/link'
import { useTranslation } from "react-i18next"

export default function NotFound() {
    const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">{t('common.notFound')}</h2>
      <p>{t('common.pageNotFound')}</p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        {t('common.returnHome')}
      </Link>
    </div>
  )
}