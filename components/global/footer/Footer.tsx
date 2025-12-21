export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 dark:bg-zinc-900/50">
      <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
      <p className="text-xs text-gray-500">© 2024 My Website. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <span className="text-xs text-gray-500">备案号: XXX</span>
      </nav>
      </div>
    </footer>
  );
}