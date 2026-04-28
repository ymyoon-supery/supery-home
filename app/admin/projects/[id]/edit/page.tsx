import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectByIdFromData } from "@/lib/data";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectByIdFromData(id);
  if (!project) notFound();

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
          <h1 className="text-lg font-bold text-[#1A1A1A]">프로젝트 수정</h1>
        </div>
        <div className="bg-white rounded-2xl border border-[#E0E0DC] p-8">
          <ProjectForm project={project} />
        </div>
      </div>
    </div>
  );
}
