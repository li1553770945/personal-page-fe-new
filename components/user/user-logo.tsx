"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Login } from "./login"
import { Register } from "./register"
import { UserInfo } from "./user-info"
import { User } from "lucide-react"
import { useUser } from "@/store/user"
import { useNotification } from "@/store/notification"
import { useTranslation } from "react-i18next"
export function UserLogo() {
    const { user, refresh } = useUser()
    const { t } = useTranslation()

    const isLoggedIn = user != null;
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<'login' | 'register' | 'info'>('login')
    const { notificationSuccess } = useNotification()


    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen) {
            if (isLoggedIn) setView('info')
            else setView('login')
        }
    }


    const handleRegisterSuccess = () => {
        notificationSuccess(t('auth.registerSuccess'), t('auth.registerSuccessDesc'))
        setView('login')
    }
    const handleLoginSuccess = (data?: any) => {
        notificationSuccess(t('auth.loginSuccess'), t('auth.welcomeBack', { nickname: data?.nickname ?? user?.nickname }))
        handleOpenChange(false)
    }
    useEffect(() => {
        refresh().then((res) => {
            if (res.ok) {
                notificationSuccess(t('auth.getUserInfoSuccess'), t('auth.welcomeBack', { nickname: res.data?.nickname }))
            } else {
                handleOpenChange(false)
            }
        })
    }, [])
    return (
        <div>
            {isLoggedIn ? (
                <Avatar onClick={() => handleOpenChange(true)} className="cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={user?.avatar} alt={user?.nickname} />
                    <AvatarFallback>{user?.nickname[0]}</AvatarFallback>
                </Avatar>
            ) : (
                <Button onClick={() => handleOpenChange(true)} variant="ghost" size="icon" className="rounded-full">
                    <User className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{t('auth.login')}</span>
                </Button>
            )}
            {open && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        {view === 'login' && (
                            <Login
                                onRegisterClick={() => setView('register')}
                                onLoginSuccess={handleLoginSuccess}
                            />
                        )}
                        {view === 'register' && (
                            <Register
                                onLoginClick={() => setView('login')}
                                onRegisterSuccess={handleRegisterSuccess}
                            />
                        )}
                        {view === 'info' && (
                            <UserInfo
                                onLogoutAction={() => {
                                    setView('login')
                                    handleOpenChange(false)
                                }}
                            />
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
