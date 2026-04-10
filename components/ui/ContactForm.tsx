"use client";

import { useState } from "react";

const inquiryTypes = [
  "SNS 운영",
  "캠페인",
  "인플루언서 마케팅",
  "영상 제작",
  "브랜딩",
  "기타",
];

interface FormData {
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    inquiryType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", email: "", company: "", inquiryType: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-[var(--text-heading)] placeholder-[var(--text-caption)] text-sm focus:outline-none focus:border-[var(--text-heading)] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold tracking-widest text-[var(--text-caption)] uppercase mb-2">
            이름 *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="홍길동"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-widest text-[var(--text-caption)] uppercase mb-2">
            이메일 *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="hello@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold tracking-widest text-[var(--text-caption)] uppercase mb-2">
            회사명
          </label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="(주)회사명"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-widest text-[var(--text-caption)] uppercase mb-2">
            문의 유형 *
          </label>
          <select
            name="inquiryType"
            value={form.inquiryType}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">선택해주세요</option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-widest text-[var(--text-caption)] uppercase mb-2">
          메시지 *
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="문의 내용을 입력해주세요."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-4 bg-[var(--btn-bg)] text-[var(--btn-text)] font-semibold text-sm tracking-widest uppercase rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "전송 중..." : "문의 보내기"}
      </button>

      {/* Toast */}
      {status === "success" && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          전송에 실패했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}
    </form>
  );
}
