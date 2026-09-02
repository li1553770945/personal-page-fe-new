export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 w-full border-t border-border/80">
      <div className="flex w-full shrink-0 flex-col items-center justify-center gap-2 px-4 py-8 sm:flex-row sm:justify-between md:px-8">
      <p className="text-xs text-muted-foreground">© {year} PeaceSheep · 持续记录，持续生长。</p>
      <nav className="flex gap-4 sm:gap-6">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          冀ICP备2025103290号
        </a>
      </nav>
      </div>
    </footer>
  );
}
