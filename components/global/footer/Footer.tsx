export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full">
      <div className="flex flex-col gap-2 py-6 w-full shrink-0 items-center justify-center px-4 md:px-6">
      <p className="text-xs text-gray-500">Copyright © {year} PeaceSheep. All rights reserved.</p>
      <nav className="flex gap-4 sm:gap-6">
        <span className="text-xs text-gray-500">
        冀ICP备2025103290号</span>
      </nav>
      </div>
    </footer>
  );
}