"use client";

import { useRouter } from "next/navigation";

interface Props {
  id: string;
  title: string;
}

export default function AdminDeleteButton({ id, title }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`"${title}" 프로젝트를 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
    >
      삭제
    </button>
  );
}
