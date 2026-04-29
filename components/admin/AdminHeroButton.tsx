"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  inHero: boolean;
}

export default function AdminHeroButton({ id, inHero: initial }: Props) {
  const [inHero, setInHero] = useState(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    const newValue = !inHero;
    setLoading(true);
    // Optimistically update UI immediately
    setInHero(newValue);
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inHero: newValue }),
    });
    const data = await res.json();
    if (res.ok) {
      // Refresh server component to sync with actual saved state
      router.refresh();
    } else {
      // Revert optimistic update on error
      setInHero(!newValue);
      alert(data.error ?? "오류가 발생했습니다.");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={inHero ? "Hero에서 제외" : "Hero에 추가"}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50 ${
        inHero
          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-[#333]"
          : "text-[#555] border-[#E0E0DC] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
      }`}
    >
      {loading ? "..." : inHero ? "Hero ✓" : "Hero"}
    </button>
  );
}
