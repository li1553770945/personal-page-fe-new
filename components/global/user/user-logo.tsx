"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Login } from "./login"
import { Register } from "./register"
import { UserInfo } from "./user-info"
import { User } from "lucide-react"
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'

export function UserLogo() {
    // 1. 获取全局 mutate 方法 (用于在其他地方通知刷新，或者使用 hook 返回的 mutate)
    // 这里的 mutate 是针对当前 key 的特定刷新函数
    const {
        data: userData,
        error,
        isLoading,
        mutate // 重要：手动刷新数据的函数
    } = useSWR('/users/me', fetcher, {
        shouldRetryOnError: false, // 如果 401 了，不要一直重试，直接算未登录
        revalidateOnFocus: false,  // 窗口聚焦时不必须刷新，看你需求
    })

    // 2. 只有当获取到数据且没有错误时，才算已登录
    const isLoggedIn = !error && userData;
    // 如果 API 返回的数据结构是 { data: { username: ... } }，这里可能需要调整为 userData?.data
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<'login' | 'register' | 'info'>('login')

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen) {
            if (isLoggedIn) setView('info')
            else setView('login')
        }
    }

    const handleLoginSuccess = async () => {
        // 3. 登录成功后，关键一步！
        // 调用 mutate() 告诉 SWR："数据脏了，重新去 /users/me 拉一次"
        // 这样头像会自动变成用户头像，不需要手动 setIsLoggedIn
        await mutate()
        setOpen(false)
    }

    const handleLogout = async () => {
        // 如果你有退出登录逻辑，清理 token 后：
        localStorage.removeItem("token"); // 或者调用 logoutAPI
        await mutate(null, false) // 立即把本地缓存清空，UI 变回未登录状态
    }

    const handleRegisterSuccess = () => {
        // Switch to login after successful registration
        setView('login')
    }
    const handleUpdateUser = async () => {
        // 假设 UserInfo 组件里已经发了 updateAPI 请求
        // 这里只需要刷新数据
        await mutate()
        setOpen(false)
    }
    // const handleUpdateUser = (newData: { username: string; nickname: string; avatar: string }) => {
    //     setUser(newData)
    //     setOpen(false)
    // }

    return (
        <div>
            {/* 如果用户已登录，显示头像；否则显示登录按钮 */}
            {isLoggedIn ? (
                <Avatar onClick={() => handleOpenChange(true)} className="cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={userData?.avatar} alt={userData?.nickname} />
                    <AvatarFallback>{userData?.nickname[0]}</AvatarFallback>
                </Avatar>
            ) : (
                <Button onClick={() => handleOpenChange(true)} variant="ghost" size="icon" className="rounded-full">
                    <User className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Login</span>
                </Button>
            )}
            { /* 如果弹窗打开，显示登录/注册/个人信息弹窗 */}
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
                            // onLoginClick={() => setView('login')}
                            // onRegisterSuccess={handleRegisterSuccess}
                            />
                        )}
                        {view === 'info' && (
                            <UserInfo
                                initialUser={userData}
                                onSave={handleUpdateUser}
                            />
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
