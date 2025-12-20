"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Sun, Moon } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { t } from "i18next"

const navItems = [
    { label: t('nav.projects'), href: "/#projects" },
    { label: t('nav.experience'), href: "/#experience" },
    { label: t('nav.skills'), href: "/#skills" },
    { label: t('nav.awards'), href: "/#awards" },
    { label: t('nav.blog'), href: "/blog" }, // 未来独立页
]
export function Navbar() {
    const [isDark, setIsDark] = useState(false)
    const { t, i18n } = useTranslation()

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [isDark])

    const toggleLanguage = () => {
        const newLang = i18n.language === 'zh' ? 'en' : 'zh'
        i18n.changeLanguage(newLang)
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/70">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <Link href="/" className="font-black tracking-tight text-gray-900 dark:text-zinc-50">
                    Peace<span className="text-amber-300">Sheep</span>
                </Link>

                {/* Desktop */}
                <nav className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-1">
                            {navItems.map((it) => (
                                <NavigationMenuItem key={it.href}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={it.href}
                                            className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50"
                                        >
                                            {it.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>

                <div className="hidden md:flex items-center gap-2">
                    <Button onClick={() => setIsDark(!isDark)} variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-50">
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                    <Button onClick={toggleLanguage} variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-50">
                        {i18n.language === 'zh' ? 'EN' : '中'}
                    </Button>
                    <Button asChild variant="secondary" className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
                    >
                        <a href="/resume.pdf" target="_blank" rel="noreferrer">{t('nav.resume')}</a>
                    </Button>
                    <Button asChild className="bg-amber-300 text-zinc-950 hover:bg-amber-200">
                        <a href="mailto:peacesheep@qq.com">{t('nav.contact')}</a>
                    </Button>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="secondary" className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800">
                                Menu
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="border-gray-200 bg-white text-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                            <SheetHeader>
                                <SheetTitle className="text-gray-900 dark:text-zinc-50">{t('nav.navigation')}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 grid gap-2">
                                {navItems.map((it) => (
                                    <SheetClose asChild key={it.href}>
                                        <Link
                                            href={it.href}
                                            className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-700 hover:border-amber-300/40 transition dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200"
                                        >
                                            {it.label}
                                        </Link>
                                    </SheetClose>
                                ))}

                                <div className="mt-4 grid gap-2">
                                    <Button onClick={() => setIsDark(!isDark)} variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-50">
                                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    </Button>
                                    <Button onClick={toggleLanguage} variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-50">
                                        {i18n.language === 'zh' ? 'EN' : '中'}
                                    </Button>
                                    <Button asChild variant="secondary" className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800">
                                        <a href="/resume.pdf" target="_blank" rel="noreferrer">{t('nav.resume')}</a>
                                    </Button>
                                    <Button asChild className="bg-amber-300 text-zinc-950 hover:bg-amber-200">
                                        <a href="mailto:peacesheep@qq.com">{t('nav.contact')}</a>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
