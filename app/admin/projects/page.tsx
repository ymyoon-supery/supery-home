import Link from "next/link";
import Image from "next/image";
import { readProjectsAsync } from "@/lib/data";
import AdminLogout from "@/components/admin/AdminLogout";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await readProjectsAsync();

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">프로젝트 관리</h1>
            <p className="text-sm text-[#777] mt-1">총 {projects.length}개</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-sm font-semibold tracking-wider rounded-xl hover:bg-[#333] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            새 프로젝트
          </Link>
        </div>

        {/* Project list */}
        <div className="bg-white rounded-2xl border border-[#E0E0DC] overflow-hidden">
          {projects.length === 0 ? (
            <div className="py-20 text-center text-[#AAA] text-sm">프로젝트가 없습니다.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0E0DC]">
                  <th className="px-5 py-3 text-left text-xs font-semibold tracking-widest text-[#AAA] uppercase">이미지</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold tracking-widest text-[#AAA] uppercase">제목</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold tracking-widest text-[#AAA] uppercase hidden md:table-cell">카테고리</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold tracking-widest text-[#AAA] uppercase hidden sm:table-cell">홈 노출</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold tracking-widest text-[#AAA] uppercase">관리</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, i) => (
                  <tr
                    key={project.id}
                    className={`${i !== projects.length - 1 ? "border-b border-[#F0F0EE]" : ""} hover:bg-[#FAFAF8] transition-colors`}
                  >
                    <td className="px-5 py-4">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-[#F5F5F3]">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#1A1A1A] leading-snug">{project.title}</p>
                      {project.description && (
                        <p className="text-xs text-[#AAA] mt-0.5 line-clamp-1">{project.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="inline-block px-2.5 py-1 bg-[#F5F5F3] text-[#555] text-xs font-semibold rounded-full">
                        {project.categoryLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center hidden sm:table-cell">
                      {project.featured ? (
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                      ) : (
                        <span className="inline-block w-2 h-2 rounded-full bg-[#E0E0DC]" />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="px-3 py-1.5 text-xs font-semibold text-[#555] border border-[#E0E0DC] rounded-lg hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                        >
                          수정
                        </Link>
                        <AdminDeleteButton id={project.id} title={project.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
