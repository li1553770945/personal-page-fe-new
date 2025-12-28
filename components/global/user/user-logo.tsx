"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Login } from "./login"
import { Register } from "./register"
import { UserInfo } from "./user-info"
import { User } from "lucide-react"

export function UserLogo() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState({
        username: "user",
        nickname: "User",
        avatar: "https://github.com/shadcn.png"
    })
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<'login' | 'register' | 'info'>('login')

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen) {
            if (isLoggedIn) setView('info')
            else setView('login')
        }
    }

    const handleLoginSuccess = () => {
        setIsLoggedIn(true)
        setOpen(false)
    }

    const handleRegisterSuccess = () => {
        // Switch to login after successful registration
        setView('login')
    }

    const handleUpdateUser = (newData: { username: string; nickname: string; avatar: string }) => {
        setUser(newData)
        setOpen(false)
    }

    return (
        <div>
            {/* 如果用户已登录，显示头像；否则显示登录按钮 */}
            {isLoggedIn ? (
                <Avatar onClick={() => handleOpenChange(true)} className="cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={user.avatar} alt={user.nickname} />
                    <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                </Avatar>
            ) : (
                <Button onClick={() => handleOpenChange(true)} variant="ghost" size="icon" className="rounded-full">
                    <User className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Login</span>
                </Button>
            )}
            { /* 如果弹窗打开，显示登录/注册/个人信息弹窗 */}
            {open && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
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
                            // onLoginClick={() => setView('login')}
                            // onRegisterSuccess={handleRegisterSuccess}
                            />
                        )}
                        {view === 'info' && (
                            <UserInfo
                                initialUser={user}
                                onSave={handleUpdateUser}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
