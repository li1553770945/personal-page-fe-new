"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/context/notification"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { useUser } from "@/context/user"

type UserInfoFormData = {
  username: string
  nickname: string
  avatar: string
}

type UserInfoProps = {
  onLogout?: () => void
}

export function UserInfo({ onLogout }: UserInfoProps) {
  const { t } = useTranslation()
  const { success, error, warning, info } = useNotification()
  const { user, logout } = useUser()
  const [formData, setFormData] = useState<UserInfoFormData>({
    username: user?.username || "",
    nickname: user?.nickname || "",
    avatar: user?.avatar || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    if (id === "username") {
      setFormData((prev) => ({ ...prev, username: value }))
      return
    }
    if (id === "nickname") {
      setFormData((prev) => ({ ...prev, nickname: value }))
      return
    }
    if (id === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: value }))
      return
    }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    warning(t('common.notice'), "该功能暂未实现")
    // success("Profile updated successfully","Profile updated successfully")
  }

  const handleLogout = () => {
    logout()
    success(t('auth.logoutSuccess'),"")
    onLogout && onLogout()
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{t('userInfo.title')}</CardTitle>
        <CardDescription>
          {t('userInfo.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="user-info-form">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                {t('auth.username')}
              </Label>
              <Input
                id="username"
                value={formData.username}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nickname" className="text-right">
                {t('userInfo.nickname')}
              </Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                {t('userInfo.avatarUrl')}
              </Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleLogout}>
          {t('auth.logout')}
        </Button>
        <Button type="submit" form="user-info-form">
          {t('auth.saveChanges') }
        </Button>
      </CardFooter>
    </Card>
  )
}
