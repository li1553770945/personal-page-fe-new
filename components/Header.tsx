import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b px-4 md:px-6 bg-white dark:bg-zinc-950">
      <Link className="flex items-center gap-2 font-bold" href="/">
        我的网站
      </Link>
      <nav className="flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline" href="/">首页</Link>
        <Link className="text-sm font-medium hover:underline" href="/about">关于</Link>
      </nav>
    </header>
  );
}