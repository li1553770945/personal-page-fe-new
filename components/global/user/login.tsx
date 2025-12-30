"use client"

import { useState } from "react"
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
import { useTranslation } from "react-i18next"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { useUser } from "@/context/user"
import { useNotification } from "@/context/notification"
interface LoginProps {
    onRegisterClick: () => void
    onLoginSuccess: (data:any) => void
}

export function Login({ onRegisterClick, onLoginSuccess }: LoginProps) {
    const { t } = useTranslation()
    const { success, error } = useNotification()
    const { login } = useUser()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await login({ username, password })
            if (!res.ok) {
                error(t('auth.loginFailed'), res.message);
                return
            }
            onLoginSuccess(res.data)
        } catch (err: any) {
            error(t('auth.loginFailed'), err?.message ?? String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="relative w-[350px] overflow-hidden">
            {/* <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} /> */}
            <CardHeader>
                <CardTitle>{t('auth.login')}</CardTitle>
                <CardDescription>
                    {t('auth.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">{t('auth.username')}</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder={t('auth.usernamePlaceholder')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">{t('auth.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={t('auth.passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        {/* Hidden submit button to handle Enter key */}
                        <button type="submit" className="hidden" disabled={loading} />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <ShimmerButton onClick={onRegisterClick} disabled={loading}>{t('auth.register')}</ShimmerButton>
                <Button onClick={handleLogin} disabled={loading}>
                    {loading ? "..." : t('auth.login')}
                </Button>
            </CardFooter>
        </Card>
    )
}
