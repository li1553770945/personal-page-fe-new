"use client"

import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/global/header/mode-toggle"
import { LanguageToggle } from "@/components/global/header/language-toggle"
import { HomeIcon } from "@/components/ui/icons/heroicons-home"
import { BookOpenIcon } from "@/components/ui/icons/heroicons-book-open"
import { ChatBubbleOvalLeftSolidIcon } from "@/components/ui/icons/heroicons-chat-bubble-oval-left-solid"
import { MailOutlinedIcon } from "@/components/ui/icons/ant-design-mail-outlined"
import { GithubFilledIcon } from "@/components/ui/icons/ant-design-github-filled"
import { MessageOutlinedIcon } from "@/components/ui/icons/ant-design-message-outlined"
import { RocketLaunchIcon } from "@/components/ui/icons/heroicons-rocket-launch"
import { FileOutlinedIcon } from "@/components/ui/icons/ant-design-file-outlined"
import { UserGroupIcon } from "@/components/ui/icons/heroicons-user-group"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface NavItem {
    label: string
    href?: string
    icon?: React.ElementType
    subItem?: {
        label: string
        href: string
        icon?: React.ElementType
    }[]
}

export default function Header() {
    const { t } = useTranslation();
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            label: t('nav.home'),
            icon: HomeIcon,
            href: "/",
        },
        {
            label: t('nav.blog'),
            icon: BookOpenIcon,
            href: "/blog",
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
                }
            ]
        },
        {
            label: t('nav.contact'),
            icon: ChatBubbleOvalLeftSolidIcon,
            subItem: [
                {
                    label: t('nav.email'),
                    icon: MailOutlinedIcon,
                    href: "mailto:peacesheep@qq.com",
                },
                {
                    label: t('nav.github'),
                    icon: GithubFilledIcon,
                    href: "https://github.com/li1553770945",
                },
                {
                    label: t('nav.consultation'),
                    icon: MessageOutlinedIcon,
                    href: "/feedback"
                }
            ]
        },
        // {
        //     label: "关于",
        //     href: "/about",
        // }
    ]

    return (
        <header className="w-full">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <NavigationMenu viewport={false}>
                    <NavigationMenuList>
                        {navItems.map((item) => {
                            const isActive = item.href && pathname === item.href;

                            const hasSub = item.subItem && item.subItem.length > 0
                            const IconComp = item.icon

                            if (hasSub) {
                                return (
                                    <NavigationMenuItem key={item.label} className='hover:border-b-3 hover:border-(--underline-background)'>
                                        <NavigationMenuTrigger>
                                            {IconComp ? <IconComp className="mr-2 size-4 text-foreground" /> : null}
                                            {item.label}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid min-w-[150px] w-fit max-w-[360px] gap-3 p-4">
                                                {item.subItem?.map((sub) => (
                                                    <li key={sub.label} className='hover:border-b-3 hover:border-(--underline-background)'>
                                                        <NavigationMenuLink asChild >
                                                            <Link href={sub.href} className={cn("flex flex-row items-center")}>
                                                                {sub.icon ? <sub.icon className="mr-2 size-4 text-foreground" /> : null}
                                                                <div>{sub.label}</div>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                )
                            }

                            return (
                                <NavigationMenuItem key={item.label} className={cn('hover:border-b-3 hover:border-(--underline-background)', isActive && 'border-b-3 hover:border-(--underline-background)')}>
                                    <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "flex-row items-center ")}>
                                        <Link href={item.href || '#'}>
                                            {IconComp ? <IconComp className="mr-2 size-4 text-foreground" /> : null}
                                            {item.label}
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
                </div>
            </div>
            {/* 分割线 */}
            <div className="mx-[30px] h-0 border-b-2 border-(--seprator-background)" />
        </header>
    );
}
