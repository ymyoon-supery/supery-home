"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categories, categoryLabels, type Category, type Project, type MediaItem } from "@/lib/projects";

interface Props {
  project?: Project;
}

const MAX_MEDIA = 10;

export default function ProjectForm({ project }: Props) {
  const isEdit = Boolean(project);
  const router = useRouter();

  // 기존 media 또는 image → media 배열로 초기화
  const initMedia: MediaItem[] = project?.media?.length
    ? project.media
    : project?.image
    ? [{ url: project.image, type: "image" as const }]
    : [];

  const [form, setForm] = useState({
    title: project?.title ?? "",
    category: (project?.category ?? "sns-management") as Exclude<Category, "all">,
    description: project?.description ?? "",
    featured: project?.featured ?? false,
  });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initMedia);
  const [coverIndex, setCoverIndex] = useState(0);
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
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = MAX_MEDIA - mediaItems.length;
    if (remaining <= 0) { setError(`최대 ${MAX_MEDIA}개까지 업로드 가능합니다.`); return; }
    const toUpload = files.slice(0, remaining);
    setUploading(true);
    setError("");
    try {
      const results = await Promise.all(
        toUpload.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? res.status);
          return { url: data.url, type: data.type } as MediaItem;
        })
      );
      setMediaItems((prev) => [...prev, ...results]);
    } catch (err) {
      setError(`업로드 오류: ${String(err)}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeMedia = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
    if (coverIndex >= index && coverIndex > 0) setCoverIndex((c) => c - 1);
    else if (coverIndex === index) setCoverIndex(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaItems.length === 0) { setError("미디어를 최소 1개 이상 추가해주세요."); return; }
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      image: mediaItems[coverIndex]?.url ?? mediaItems[0]?.url ?? "",
      media: mediaItems,
    };

    const url = isEdit ? `/api/admin/projects/${project!.id}` : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
        <label className="block text-xs font-semibold tracking-widest text-[#777] uppercase mb-2">프로젝트 제목 *</label>
        <input name="title" value={form.title} onChange={handleChange} required placeholder="프로젝트 제목" className={inputClass} />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold tracking-widest text-[#777] uppercase mb-2">카테고리 *</label>
        <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
          {categories.filter((c) => c !== "all").map((cat) => (
            <option key={cat} value={cat}>{categoryLabels[cat]}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold tracking-widest text-[#777] uppercase mb-2">설명</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="프로젝트 설명" className={`${inputClass} resize-none`} />
      </div>

      {/* Media */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold tracking-widest text-[#777] uppercase">
            이미지 / 동영상 * ({mediaItems.length}/{MAX_MEDIA})
          </label>
          {mediaItems.length < MAX_MEDIA && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {uploading ? "업로드 중..." : "추가"}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {mediaItems.length === 0 ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#E0E0DC] rounded-xl p-10 text-center cursor-pointer hover:border-[#1A1A1A] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#AAA] mx-auto mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-[#777]">클릭하여 이미지 또는 동영상 선택</p>
            <p className="text-xs text-[#AAA] mt-1">JPG, PNG, WEBP, GIF, MP4, WEBM (최대 {MAX_MEDIA}개)</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {mediaItems.map((item, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-[#F5F5F3] border-2 transition-colors"
                style={{ borderColor: i === coverIndex ? "#1A1A1A" : "#E0E0DC" }}>

                {item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  <Image src={item.url} alt="" fill className="object-cover" unoptimized sizes="150px" />
                )}

                {/* Video badge */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Cover badge */}
                {i === coverIndex && (
                  <div className="absolute top-1.5 left-1.5 bg-[#1A1A1A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider">
                    대표
                  </div>
                )}

                {/* Hover controls */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {i !== coverIndex && (
                    <button
                      type="button"
                      onClick={() => setCoverIndex(i)}
                      title="대표 이미지로 설정"
                      className="w-7 h-7 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center hover:bg-yellow-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    title="삭제"
                    className="w-7 h-7 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Add more button */}
            {mediaItems.length < MAX_MEDIA && (
              <div
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-[#E0E0DC] flex items-center justify-center cursor-pointer hover:border-[#1A1A1A] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#AAA]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
            )}
          </div>
        )}

        {mediaItems.length > 0 && (
          <p className="text-xs text-[#AAA] mt-2">★ 아이콘을 눌러 대표 이미지를 변경할 수 있습니다.</p>
        )}
      </div>

      {/* Featured */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-[#1A1A1A]" />
        <span className="text-sm text-[#1A1A1A] font-medium">홈 화면에 노출 (슬라이더 + Latest Works)</span>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 border border-[#E0E0DC] text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#F5F5F3] transition-colors text-[#777]">
          취소
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-3 bg-[#1A1A1A] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50">
          {saving ? "저장 중..." : isEdit ? "수정 저장" : "프로젝트 추가"}
        </button>
      </div>
    </form>
  );
}
