import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin/projects"
            className="text-[#777] hover:text-[#1A1A1A] transition-colors"
          >
            ← 목록으로
          </Link>
          <span className="text-[#E0E0DC]">/</span>
          <h1 className="text-lg font-bold text-[#1A1A1A]">새 프로젝트</h1>
        </div>
        <div className="bg-white rounded-2xl border border-[#E0E0DC] p-8">
          <ProjectForm />
        </div>
      </div>
    </div>
  );
}
