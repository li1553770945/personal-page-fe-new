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

const navItems: NavItem[] = [
    {
        label: "主页",
        icon: HomeIcon,
        href: "/",
    },
    {
        label: "博客",
        icon: BookOpenIcon,
        href: "/blog",
    },
    {
        label: "工具箱",
        icon: RocketLaunchIcon,
        subItem: [
            {
                label: "文件管理",
                icon: FileOutlinedIcon,
                href: "/files",
            },
            {
                label: "临时群聊",
                icon: UserGroupIcon,
                href: "/chat",
            }
        ]
    },
    {
        label: "联系",
        icon: ChatBubbleOvalLeftSolidIcon,
        subItem: [
            {
                label: "邮箱",
                icon: MailOutlinedIcon,
                href: "mailto:peacesheep@qq.com",
            },
            {
                label: "Github",
                icon: GithubFilledIcon,
                href: "https://github.com/li1553770945",
            },
            {
                label: "咨询&留言",
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

export default function Header() {
    return (
        <header className="w-full border-b bg-[oklch(0.9975_0.0017_67.8)]">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <NavigationMenu viewport={false}>
                    <NavigationMenuList>
                        {navItems.map((item) => {
                            const hasSub = item.subItem && item.subItem.length > 0
                            const IconComp = item.icon

                            if (hasSub) {
                                return (
                                    <NavigationMenuItem key={item.label}>
                                        <NavigationMenuTrigger>
                                            {IconComp ? <IconComp className="mr-2 size-4 text-foreground" /> : null}
                                            {item.label}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid min-w-[150px] w-fit max-w-[360px] gap-3 p-4">
                                                {item.subItem?.map((sub) => (
                                                    <li key={sub.label}>
                                                        <NavigationMenuLink asChild className={cn("flex-row items-center")}>
                                                            <Link href={sub.href}>
                                                                {sub.icon ? <sub.icon className="mr-2 size-4 text-foreground" /> : null}
                                                                <div className="text-sm font-medium leading-none">{sub.label}</div>
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
                                <NavigationMenuItem key={item.label}>
                                    <Link href={item.href || '#'} passHref>
                                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex-row items-center")}>
                                            {IconComp ? <IconComp className="mr-2 size-4 text-foreground" /> : null}
                                            {item.label}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            )
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
                <ModeToggle />
            </div>
        </header>
    );
}
