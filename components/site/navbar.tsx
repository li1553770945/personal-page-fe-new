"use client"

import Link from "next/link"
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

const navItems = [
    { label: "Projects", href: "/#projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Awards", href: "/#awards" },
    { label: "Blog", href: "/blog" }, // 未来独立页
]
export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <Link href="/" className="font-black tracking-tight">
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
                                            className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:text-zinc-50 hover:bg-zinc-900/50 transition"
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
                    <Button asChild variant="secondary" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                    >
                        <a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>
                    </Button>
                    <Button asChild className="bg-amber-300 text-zinc-950 hover:bg-amber-200">
                        <a href="mailto:peacesheep@qq.com">Contact</a>
                    </Button>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="secondary" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                Menu
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="border-zinc-800 bg-zinc-950 text-zinc-50">
                            <SheetHeader>
                                <SheetTitle className="text-zinc-50">Navigation</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 grid gap-2">
                                {navItems.map((it) => (
                                    <SheetClose asChild key={it.href}>
                                        <Link
                                            href={it.href}
                                            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-zinc-200 hover:border-amber-300/40 transition"
                                        >
                                            {it.label}
                                        </Link>
                                    </SheetClose>
                                ))}

                                <div className="mt-4 grid gap-2">
                                    <Button asChild variant="secondary" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                        <a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>
                                    </Button>
                                    <Button asChild className="bg-amber-300 text-zinc-950 hover:bg-amber-200">
                                        <a href="mailto:peacesheep@qq.com">Contact</a>
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
