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
import { loginAPI } from "@/api"

interface LoginProps {
    onRegisterClick: () => void
    onLoginSuccess: () => void
}

export function Login({ onRegisterClick, onLoginSuccess }: LoginProps) {
    const { t } = useTranslation()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res: any = await loginAPI({ username, password })
            console.log("Login response:", res)
            if (!res) {
                setError(t('auth.loginFailed') || "Login failed")
                return
            }

            if (res.code != 0) {
                setError(res.message || t('auth.loginFailed'));
                return
            }
            localStorage.setItem("token", res.data.token)
            onLoginSuccess()
        } catch (err: any) {
            console.error("Login error:", err)
            setError(err.response?.message || t('auth.loginFailed') || "Login failed")
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
                        {error && (
                            <div className="text-sm text-red-500 font-medium">
                                {error}
                            </div>
                        )}
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
