import Link from "next/link";
import Image from "next/image";
import { readSiteContentAsync } from "@/lib/siteData";
import AdminLogout from "@/components/admin/AdminLogout";
import SiteContentEditor from "@/components/admin/SiteContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const content = await readSiteContentAsync();

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E0E0DC] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src="https://cdn.imweb.me/thumbnail/20260225/b46c0438a299b.png"
              alt="SUPER Y"
              width={90}
              height={28}
              className="h-6 w-auto object-contain"
              unoptimized
            />
            <span className="text-xs font-semibold tracking-widest text-[#AAA] uppercase">Admin</span>
            <nav className="flex items-center gap-4 ml-4">
              <Link href="/admin/projects" className="text-xs text-[#777] hover:text-[#1A1A1A] transition-colors">
                프로젝트
              </Link>
              <Link href="/admin/site" className="text-xs font-semibold text-[#1A1A1A] border-b border-[#1A1A1A]">
                사이트 콘텐츠
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[#777] hover:text-[#1A1A1A] transition-colors"
            >
              사이트 보기 ↗
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">사이트 콘텐츠 관리</h1>
          <p className="text-sm text-[#777] mt-1">홈, About, Contact, Footer 문구를 수정합니다.</p>
        </div>

        <SiteContentEditor initial={content} />
      </main>
    </div>
  );
}
