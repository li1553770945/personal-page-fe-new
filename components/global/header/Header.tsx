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
} from "@/components/global/header/navigation-menu"
import { ModeToggle } from "@/components/global/header/mode-toggle"

interface NavItem {
    label: string
    href?: string
    subItem?: {
        label: string
        href: string
    }[]
}

const navItems: NavItem[] = [
    {
        label: "主页",
        href: "/",
    },
    {
        label: "项目",
        href: "/projects",
    },
     {
        label: "工具箱",
        subItem: [
            {
                label: "文件管理",
                href: "/files",
            },
            {
                label: "临时群聊",
                href: "/chat",
            }
        ]
    },
    {
        label: "联系",
        subItem: [
            {
                label: "邮箱",
                href: "mailto:peacesheep@qq.com",
            },
            {
                label: "Github",
                href: "https://github.com/li1553770945",
            },
            {
                label: "咨询&留言",
                href: "/feedback"
            }
        ]
    },
    {
        label: "关于",
        href: "/about",
    }
]

export default function Header() {
    return (
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <NavigationMenu>
                <NavigationMenuList>
                    {navItems.map((item) => {
                        const hasSub = item.subItem && item.subItem.length > 0

                        if (hasSub) {
                            return (
                                <NavigationMenuItem key={item.label}>
                                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[200px] gap-3 p-4">
                                            {item.subItem?.map((sub) => (
                                                <li key={sub.label}>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={sub.href}
                                                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                        >
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
                                <Link href={item.href || '#'} legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
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
