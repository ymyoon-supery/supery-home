import Link from "next/link";
import Image from "next/image";
import AdminLogout from "@/components/admin/AdminLogout";
import { readProjectsAsync } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const projects = await readProjectsAsync();

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E0E0DC] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="https://cdn.imweb.me/thumbnail/20260225/b46c0438a299b.png"
              alt="SUPER Y"
              width={90}
              height={28}
              className="h-6 w-auto object-contain"
              unoptimized
            />
            <span className="text-xs font-semibold tracking-widest text-[#AAA] uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-xs text-[#777] hover:text-[#1A1A1A] transition-colors">
              사이트 보기 ↗
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">대시보드</h1>
        <p className="text-sm text-[#777] mb-12">관리할 항목을 선택하세요.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 프로젝트 관리 */}
          <Link
            href="/admin/projects"
            className="group bg-white border border-[#E0E0DC] rounded-2xl p-8 hover:border-[#1A1A1A] hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 bg-[#F5F5F3] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1A1A1A] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#1A1A1A] group-hover:text-white transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">프로젝트 관리</h2>
            <p className="text-sm text-[#777]">총 {projects.length}개 프로젝트 · 추가, 수정, 삭제</p>
          </Link>

          {/* 사이트 콘텐츠 */}
          <Link
            href="/admin/site"
            className="group bg-white border border-[#E0E0DC] rounded-2xl p-8 hover:border-[#1A1A1A] hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 bg-[#F5F5F3] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1A1A1A] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#1A1A1A] group-hover:text-white transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">사이트 콘텐츠</h2>
            <p className="text-sm text-[#777]">홈 · About · Contact · Footer 문구 편집</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
