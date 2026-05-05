export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full">
      <div className="flex flex-col gap-2 py-6 w-full shrink-0 items-center justify-center px-4 md:px-6">
      <p className="text-xs text-gray-500">Copyright © {year} PeaceSheep. All rights reserved.</p>
      <nav className="flex gap-4 sm:gap-6">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          冀ICP备2025103290号
        </a>
      </nav>
      </div>
    </footer>
  );
}