import Link from "next/link";
import AdminLogout from "@/components/admin/AdminLogout";

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-[#E0E0DC] sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-bold text-[#1A1A1A] tracking-widest">
            SUPER Y
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/admin/projects"
              className="px-3 py-1.5 text-xs font-semibold text-[#777] hover:text-[#1A1A1A] hover:bg-[#F5F5F3] rounded-lg transition-colors"
            >
              프로젝트
            </Link>
            <Link
              href="/admin/site"
              className="px-3 py-1.5 text-xs font-semibold text-[#777] hover:text-[#1A1A1A] hover:bg-[#F5F5F3] rounded-lg transition-colors"
            >
              사이트 콘텐츠
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-xs text-[#777] hover:text-[#1A1A1A] transition-colors">
            사이트 보기 ↗
          </Link>
          <AdminLogout />
        </div>
      </div>
    </header>
  );
}
