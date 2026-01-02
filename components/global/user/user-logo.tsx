"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Login } from "./login"
import { Register } from "./register"
import { UserInfo } from "./user-info"
import { User } from "lucide-react"
import { useUser } from "@/context/user"
import { useNotification } from "@/context/notification"
export function UserLogo() {
    const { user, refresh } = useUser()

    const isLoggedIn = user != null;
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<'login' | 'register' | 'info'>('login')
    const { success } = useNotification()


    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen) {
            if (isLoggedIn) setView('info')
            else setView('login')
        }
    }


    const handleRegisterSuccess = () => {
        success('注册成功', '您可以使用新注册的账号登录')
        setView('login')
    }
    const handleLoginSuccess = (data?: any) => {
        success('登录成功', `欢迎回来: ${data?.nickname ?? user?.nickname}`)
        handleOpenChange(false)
    }
    useEffect(() => {
        refresh().then((res) => {
            if (res.ok) {
                success("获取用户信息成功", `欢迎回来: ${res.data?.nickname}`)
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
                    <span className="sr-only">Login</span>
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
                                onLogout={() => {
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
