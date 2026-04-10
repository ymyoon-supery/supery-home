"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/projects");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F3]">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#E0E0DC] p-8">
        <div className="flex justify-center mb-8">
          <Image
            src="https://cdn.imweb.me/thumbnail/20260225/b46c0438a299b.png"
            alt="SUPER Y"
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
            unoptimized
          />
        </div>
        <h1 className="text-center text-sm font-semibold tracking-widest text-[#777] uppercase mb-8">
          Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            className="w-full px-4 py-3 border border-[#E0E0DC] rounded-xl text-sm text-[#1A1A1A] placeholder-[#AAA] focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1A1A1A] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
