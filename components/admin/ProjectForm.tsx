"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categories, categoryLabels, type Category, type Project } from "@/lib/projects";

interface Props {
  project?: Project;
}

export default function ProjectForm({ project }: Props) {
  const isEdit = Boolean(project);
  const router = useRouter();

  const [form, setForm] = useState({
    title: project?.title ?? "",
    category: (project?.category ?? "sns-management") as Exclude<Category, "all">,
    description: project?.description ?? "",
    image: project?.image ?? "",
    featured: project?.featured ?? false,
  });
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, image: url }));
    } else {
      setError("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) { setError("이미지를 입력하거나 업로드해주세요."); return; }
    setSaving(true);
    setError("");

    const url = isEdit
      ? `/api/admin/projects/${project!.id}`
      : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "저장에 실패했습니다.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-[#E0E0DC] rounded-xl text-sm text-[#1A1A1A] placeholder-[#AAA] focus:outline-none focus:border-[#1A1A1A] transition-colors bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold tracking-widest text-[#777] uppercase mb-2">
          프로젝트 제목 *
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="프로젝트 제목"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold tracking-widest text-[#777] uppercase mb-2">
          카테고리 *
        </label>
        <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
          {categories.filter((c) => c !== "all").map((cat) => (
            <option key={cat} value={cat}>{categoryLabels[cat]}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold tracking-widest text-[#777] uppercase mb-2">
          설명
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="프로젝트 설명"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-xs font-semibold tracking-widest text-[#777] uppercase mb-2">
          이미지 *
        </label>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-3">
          {(["url", "upload"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setImageMode(mode)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors ${
                imageMode === mode
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white border border-[#E0E0DC] text-[#777] hover:border-[#1A1A1A]"
              }`}
            >
              {mode === "url" ? "URL 입력" : "파일 업로드"}
            </button>
          ))}
        </div>

        {imageMode === "url" ? (
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#E0E0DC] rounded-xl p-8 text-center cursor-pointer hover:border-[#1A1A1A] transition-colors"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {uploading ? (
              <p className="text-sm text-[#777]">업로드 중...</p>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#AAA] mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-[#777]">클릭하여 이미지 선택</p>
                <p className="text-xs text-[#AAA] mt-1">JPG, PNG, WEBP, GIF</p>
              </>
            )}
          </div>
        )}

        {/* Preview */}
        {form.image && (
          <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden bg-[#F5F5F3] border border-[#E0E0DC]">
            <Image
              src={form.image}
              alt="preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Featured */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
          className="w-4 h-4 accent-[#1A1A1A]"
        />
        <span className="text-sm text-[#1A1A1A] font-medium">
          홈 화면에 노출 (슬라이더 + Latest Works)
        </span>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-[#E0E0DC] text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#F5F5F3] transition-colors text-[#777]"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 bg-[#1A1A1A] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {saving ? "저장 중..." : isEdit ? "수정 저장" : "프로젝트 추가"}
        </button>
      </div>
    </form>
  );
}
