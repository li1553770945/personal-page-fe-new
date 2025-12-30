"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BorderBeam } from "@/components/ui/border-beam"
import { useTranslation } from "react-i18next"
import { useNotification } from "@/context/notification"
import { useUser } from "@/context/user"
import { useState } from "react"

export interface RegisterProps {
  onLoginClick: () => void
  onRegisterSuccess: () => void
}
type RegisterParams = {
  username: string
  activeCode: string
  password: string
  nickname: string
}
export function Register({ onLoginClick, onRegisterSuccess }: RegisterProps) {
  const { t } = useTranslation()
  const { success, error } = useNotification()
  const { register } = useUser()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<RegisterParams>({
    username: '',
    activeCode: '',
    password: '',
    nickname: '',
  })
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await register(form)
      if (!res.ok) {
        error(t('auth.registerFailed'), res.message);
        return
      }
      onRegisterSuccess()
    } catch (err: any) {
      error(t('auth.registerFailed'), err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card className="relative w-[350px] overflow-hidden">
      <CardHeader>
        <CardTitle>{t('auth.register')}</CardTitle>
        <CardDescription>
          {t('auth.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">{t('auth.username')}</Label>
              <Input id="username" type="username" placeholder={t('auth.usernamePlaceholder')} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="active-code">{t('auth.activeCode')}</Label>
              <Input id="active-code" type="active-code" placeholder={t('auth.activeCodePlaceholder')} value={form.activeCode} onChange={(e) => setForm({ ...form, activeCode: e.target.value })} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nickname">{t('auth.nickname')}</Label>
              <Input id="nickname" type="nickname" placeholder={t('auth.nicknamePlaceholder')} value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onLoginClick}>{t('auth.login')}</Button>
        <Button onClick={handleRegister} disabled={loading}>{t('auth.register')}</Button>
      </CardFooter>
      <BorderBeam duration={8} size={100} />
    </Card>
  )
}
