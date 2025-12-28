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

export function Register() {
  const { t } = useTranslation()

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
              <Input id="username" type="username" placeholder={t('auth.usernamePlaceholder')} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="active-code">{t('auth.activeCode')}</Label>
              <Input id="active-code" type="active-code" placeholder={t('auth.activeCodePlaceholder')} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">{t('auth.login')}</Button>
        <Button>{t('auth.register')}</Button>
      </CardFooter>
      <BorderBeam duration={8} size={100} />
    </Card>
  )
}
