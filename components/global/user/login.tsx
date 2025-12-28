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
import { useTranslation } from "react-i18next"
import { ShimmerButton } from "@/components/ui/shimmer-button"
interface LoginProps {
    onRegisterClick: () => void
    onLoginSuccess: () => void
}

export function Login({ onRegisterClick, onLoginSuccess }: LoginProps) {
    const { t } = useTranslation()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Add actual login logic here
        onLoginSuccess()
    }

    return (
        <Card className="relative w-full w-[350px] overflow-hidden">
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
                            <Input id="username" type="username" placeholder={t('auth.usernamePlaceholder')} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">{t('auth.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={t('auth.passwordPlaceholder')}
                            />
                        </div>
                        {/* Hidden submit button to handle Enter key */}
                        <button type="submit" className="hidden" />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <ShimmerButton onClick={onRegisterClick}>{t('auth.register')}</ShimmerButton>
                <Button onClick={handleLogin}>{t('auth.login')}</Button>
            </CardFooter>
        </Card>
    )
}
