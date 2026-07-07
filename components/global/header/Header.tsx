"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/global/header/mode-toggle"
import { LanguageToggle } from "@/components/global/header/language-toggle"
import { HomeIcon } from "@/components/ui/icons/heroicons-home"
import { LinkOutlinedIcon } from "@/components/ui/icons/ant-design-link-outlined"
import { BookOpenIcon } from "@/components/ui/icons/heroicons-book-open"
import { ChatBubbleOvalLeftSolidIcon } from "@/components/ui/icons/heroicons-chat-bubble-oval-left-solid"
import { MailOutlinedIcon } from "@/components/ui/icons/ant-design-mail-outlined"
import { GithubFilledIcon } from "@/components/ui/icons/ant-design-github-filled"
import { MessageOutlinedIcon } from "@/components/ui/icons/ant-design-message-outlined"
import { RocketLaunchIcon } from "@/components/ui/icons/heroicons-rocket-launch"
import { FileOutlinedIcon } from "@/components/ui/icons/ant-design-file-outlined"
import { CoffeeOutlinedIcon } from "@/components/ui/icons/ant-design-coffee-outlined"
import { UserGroupIcon } from "@/components/ui/icons/heroicons-user-group"
import { FriendsIcon } from "@/components/ui/icons/friends"
import { AlertTriangle, BarChart3, Bot, ChevronDown, Files, FolderKanban, Presentation, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { UserLogo } from "@/components/user/user-logo"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { useUser } from "@/store/user"

// 导航项接口
interface NavItem {
    label: string // 导航项标签
    href?: string // 导航项链接
    icon?: React.ElementType // 导航项图标
    target?: string // 导航项目标，_blank 表示在新标签页打开
    subItem?: {
        label: string
        href: string
        icon?: React.ElementType // 子导航项图标
        target?: string // 子导航项目标
    }[]
}

export default function Header() {
    const { t } = useTranslation();
    const pathname = usePathname();
    const { user } = useUser()
    const [isHydrated, setIsHydrated] = useState(false)
    const [pendingHref, setPendingHref] = useState<string | null>(null)

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setIsHydrated(true)
        })

        return () => window.cancelAnimationFrame(frame)
    }, [])

    useEffect(() => {
        if (!pendingHref) {
            return
        }

        const timeout = window.setTimeout(() => {
            setPendingHref(null)
        }, 5000)

        return () => window.clearTimeout(timeout)
    }, [pendingHref])

    const isRoutePending = Boolean(pendingHref && pendingHref !== pathname)
    const shouldShowPendingState = !isHydrated || isRoutePending
    const isSuperAdmin = user?.role === "super_admin"

    const handleInternalNavigation = (href?: string, target?: string) => {
        if (!href || target === "_blank" || href.startsWith("http") || href.startsWith("mailto:") || href === pathname) {
            return
        }

        setPendingHref(href)
    }

    const navItems: NavItem[] = [
        {
            label: t('nav.home'),
            icon: HomeIcon,
            href: "/",
        },
        {
            label: t('nav.projects'),
            icon: FolderKanban,
            href: "/projects",
        },
        {
            label: t('nav.blog'),
            icon: BookOpenIcon,
            href: "https://blog.peacesheep.xyz",
            target: "_blank",
        },
        {
            label: t('nav.lectures'),
            icon: Presentation,
            href: "/slides",
        },
        {
            label: t('nav.tools'),
            icon: RocketLaunchIcon,
            subItem: [
                {
                    label: t('nav.fileManagement'),
                    icon: FileOutlinedIcon,
                    href: "/files",
                },
                {
                    label: t('nav.temporaryChat'),
                    icon: UserGroupIcon,
                    href: "/chat",
                },
                {
                    label: "AI 用量",
                    icon: Bot,
                    href: "/usage/ai",
                }
            ]
        },
        ...(isSuperAdmin ? [{
            label: "网站管理",
            icon: Settings,
            subItem: [
                {
                    label: "用户管理",
                    icon: Users,
                    href: "/admin/users",
                },
                {
                    label: "用户危险区",
                    icon: AlertTriangle,
                    href: "/admin/users/danger",
                },
                {
                    label: "总文件管理",
                    icon: Files,
                    href: "/admin/files",
                },
                {
                    label: "幻灯片管理",
                    icon: Presentation,
                    href: "/admin/slides",
                },
                {
                    label: "AI 用量管理",
                    icon: BarChart3,
                    href: "/admin/usage/ai",
                }
            ]
        }] : []),
        {
            label: t('nav.contact'),
            icon: ChatBubbleOvalLeftSolidIcon,
            subItem: [
                {
                    label: t('nav.email'),
                    icon: MailOutlinedIcon,
                    href: "mailto:peacesheep@qq.com",
                    target: "_blank",
                },
                {
                    label: t('nav.github'),
                    icon: GithubFilledIcon,
                    href: "https://github.com/li1553770945",
                    target: "_blank",
                },
                {
                    label: t('nav.appreciate'),
                    icon: CoffeeOutlinedIcon,
                    href: "/appreciate"
                },
                {
                    label: t('nav.consultation'),
                    icon: MessageOutlinedIcon,
                    href: "/feedback"
                }
            ]
        },
        {
            label: t('nav.friends'),
            icon: FriendsIcon,
            href: "/friends",
        },
    ]

    return (
        // 顶部固定：80%透明背景 + 中度背景模糊（毛玻璃效果），并针对支持模糊特性的浏览器优化透明度
        <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/50">
            <div
                className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden opacity-0 transition-opacity duration-200",
                    shouldShowPendingState && "opacity-100"
                )}
                aria-hidden="true"
            >
                <div className="h-full w-1/3 animate-[nav-progress_1.15s_ease-in-out_infinite] rounded-full bg-primary/70 shadow-[0_0_16px_var(--primary)] motion-reduce:animate-none" />
            </div>
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <NavigationMenu viewport={false}>
                    <NavigationMenuList>
                        {navItems.map((item) => {
                            const isActive = item.href && pathname === item.href;

                            const hasSub = item.subItem && item.subItem.length > 0
                            const IconComp = item.icon

                            if (hasSub) {
                                return (
                                    <NavigationMenuItem
                                        key={item.label}
                                        className="group/nav-item relative hover:border-b-3 hover:border-(--underline-background)"
                                    >
                                        <button
                                            type="button"
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "group flex-row items-center transition-all duration-200 ease-out active:scale-[0.98] group-hover/nav-item:bg-accent group-hover/nav-item:text-accent-foreground group-focus-within/nav-item:bg-accent group-focus-within/nav-item:text-accent-foreground"
                                            )}
                                            aria-haspopup="true"
                                        >
                                            {IconComp ? <IconComp className="mr-2 size-4 text-foreground" /> : null}
                                            {item.label}
                                            <ChevronDown
                                                className="relative top-[1px] ml-1 size-3 transition-transform duration-200 group-hover/nav-item:rotate-180 group-focus-within/nav-item:rotate-180"
                                                aria-hidden="true"
                                            />
                                        </button>
                                        <div className="invisible absolute left-0 top-full min-w-[170px] translate-y-1 pt-2 opacity-0 transition-all duration-200 ease-out group-hover/nav-item:visible group-hover/nav-item:translate-y-0 group-hover/nav-item:opacity-100 group-focus-within/nav-item:visible group-focus-within/nav-item:translate-y-0 group-focus-within/nav-item:opacity-100">
                                            <div className="rounded-md border bg-popover p-2 text-popover-foreground shadow-lg">
                                                <ul className="grid gap-1">
                                                    {item.subItem?.map((sub) => {
                                                        const SubIcon = sub.icon
                                                        const isPending = pendingHref === sub.href && sub.href !== pathname

                                                        return (
                                                            <li key={sub.label}>
                                                                <Link
                                                                    href={sub.href}
                                                                    className={cn(
                                                                        "relative flex min-h-9 flex-row items-center rounded-md px-3 py-2 text-sm transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none active:scale-[0.98]",
                                                                        isPending && "bg-accent text-accent-foreground"
                                                                    )}
                                                                    target={sub.target || '_self'}
                                                                    onClick={() => handleInternalNavigation(sub.href, sub.target)}
                                                                >
                                                                    {SubIcon ? <SubIcon className="mr-2 size-4 text-foreground" /> : null}
                                                                    <div>{sub.label}</div>
                                                                    {isPending && <span className="ml-2 size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />}
                                                                    {sub.target === '_blank' && <LinkOutlinedIcon className="ml-1 size-3 text-muted-foreground" />}
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </NavigationMenuItem>
                                )
                            }

                            return (
                                <NavigationMenuItem key={item.label} className={cn('hover:border-b-3 hover:border-(--underline-background)', isActive && 'border-b-3 hover:border-(--underline-background)')}>
                                    <NavigationMenuLink
                                        asChild
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "relative flex-row items-center transition-all duration-200 ease-out active:scale-[0.98]",
                                            pendingHref === item.href && item.href !== pathname && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <Link
                                            href={item.href || '#'}
                                            target={item.target}
                                            onClick={() => handleInternalNavigation(item.href, item.target)}
                                        >
                                            {IconComp ? <IconComp className="mr-2 size-4 text-foreground" /> : null}
                                            {item.label}
                                            {pendingHref === item.href && item.href !== pathname && <span className="ml-2 size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />}
                                            {item.target === '_blank' && <LinkOutlinedIcon className="ml-1 size-3 text-muted-foreground" />}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex items-center gap-2">
                    {/* 语言切换 */}
                    <LanguageToggle className="right-10" />
                    {/* 主题切换 */}
                    <ModeToggle />
                    {/* 用户 */}
                    <UserLogo />
                </div>
            </div>
            {/* 分割线 */}
            {/* <div className="mx-[30px] h-0 border-b-2 border-(--seprator-background)" /> */}
            <ScrollProgress className="absolute top-auto bottom-0" />
        </header>
    );
}
