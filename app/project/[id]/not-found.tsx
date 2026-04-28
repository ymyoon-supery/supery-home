"use client";

import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-[#777] text-sm">프로젝트를 찾을 수 없습니다.</p>
      <Link href="/project" className="text-sm font-semibold underline">
        전체 프로젝트 보기
      </Link>
    </div>
  );
}
