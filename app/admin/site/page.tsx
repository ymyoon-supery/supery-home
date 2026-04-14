import { readSiteContentAsync } from "@/lib/siteData";
import SiteContentEditor from "@/components/admin/SiteContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const content = await readSiteContentAsync();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">사이트 콘텐츠 관리</h1>
        <p className="text-sm text-[#777] mt-1">홈, About, Contact, Footer 문구를 수정합니다.</p>
      </div>
      <SiteContentEditor initial={content} />
    </main>
  );
}
