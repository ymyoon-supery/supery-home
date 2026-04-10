"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-[#777] hover:text-red-500 transition-colors font-medium"
    >
      로그아웃
    </button>
  );
}
