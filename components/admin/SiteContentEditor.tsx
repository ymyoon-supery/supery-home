"use client";

import { useState } from "react";
import type { SiteContent, ServiceItem, StatItem, ServiceCardItem } from "@/lib/siteContent";

type Tab = "services" | "about" | "contact" | "footer";

interface Props {
  initial: SiteContent;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#777] uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2.5 border border-[#E0E0DC] rounded-xl text-sm text-[#1A1A1A] bg-white focus:outline-none focus:border-[#1A1A1A] transition-colors resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 border border-[#E0E0DC] rounded-xl text-sm text-[#1A1A1A] bg-white focus:outline-none focus:border-[#1A1A1A] transition-colors"
        />
      )}
    </div>
  );
}

function SaveButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-2.5 bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50"
    >
      {loading ? "저장 중..." : "저장"}
    </button>
  );
}

export default function SiteContentEditor({ initial }: Props) {
  const [tab, setTab] = useState<Tab>("services");
  const [content, setContent] = useState<SiteContent>(initial);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Tab | null>(null);

  const save = async (section: Tab) => {
    setLoading(true);
    setSaved(null);
    await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [section]: content[section] }),
    });
    setLoading(false);
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  const updateServices = (patch: Partial<SiteContent["services"]>) =>
    setContent((c) => ({ ...c, services: { ...c.services, ...patch } }));

  const updateAbout = (patch: Partial<SiteContent["about"]>) =>
    setContent((c) => ({ ...c, about: { ...c.about, ...patch } }));

  const updateContact = (patch: Partial<SiteContent["contact"]>) =>
    setContent((c) => ({ ...c, contact: { ...c.contact, ...patch } }));

  const updateFooter = (patch: Partial<SiteContent["footer"]>) =>
    setContent((c) => ({ ...c, footer: { ...c.footer, ...patch } }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "services", label: "홈 서비스" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "footer", label: "Footer" },
  ];

  return (
    <div>
      {/* Tab nav */}
      <div className="flex gap-1 mb-8 bg-white border border-[#E0E0DC] rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === t.id
                ? "bg-[#1A1A1A] text-white"
                : "text-[#777] hover:text-[#1A1A1A]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Services ── */}
      {tab === "services" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6 space-y-5">
            <h2 className="font-bold text-[#1A1A1A]">텍스트</h2>
            <Field
              label="제목 (줄바꿈은 \n으로)"
              value={content.services.title}
              onChange={(v) => updateServices({ title: v })}
              multiline
            />
            <Field
              label="본문"
              value={content.services.body}
              onChange={(v) => updateServices({ body: v })}
              multiline
            />
            <Field
              label="회사소개서 다운로드 URL"
              value={content.services.downloadUrl}
              onChange={(v) => updateServices({ downloadUrl: v })}
              placeholder="#"
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#1A1A1A]">서비스 항목</h2>
              <button
                onClick={() =>
                  updateServices({
                    items: [...content.services.items, { label: "", desc: "" }],
                  })
                }
                className="text-xs font-semibold text-[#1A1A1A] border border-[#E0E0DC] px-3 py-1.5 rounded-lg hover:border-[#1A1A1A] transition-colors"
              >
                + 항목 추가
              </button>
            </div>
            <div className="space-y-3">
              {content.services.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      value={item.label}
                      onChange={(e) => {
                        const items = [...content.services.items];
                        items[i] = { ...item, label: e.target.value };
                        updateServices({ items });
                      }}
                      placeholder="레이블"
                      className="px-3 py-2 border border-[#E0E0DC] rounded-lg text-sm focus:outline-none focus:border-[#1A1A1A]"
                    />
                    <input
                      value={item.desc}
                      onChange={(e) => {
                        const items = [...content.services.items];
                        items[i] = { ...item, desc: e.target.value };
                        updateServices({ items });
                      }}
                      placeholder="설명"
                      className="px-3 py-2 border border-[#E0E0DC] rounded-lg text-sm focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const items = content.services.items.filter((_, idx) => idx !== i);
                      updateServices({ items });
                    }}
                    className="text-[#AAA] hover:text-red-500 transition-colors mt-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SaveButton loading={loading} onClick={() => save("services")} />
            {saved === "services" && <span className="text-sm text-green-600 font-medium">저장되었습니다.</span>}
          </div>
        </div>
      )}

      {/* ── About ── */}
      {tab === "about" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6 space-y-5">
            <h2 className="font-bold text-[#1A1A1A]">히어로 텍스트</h2>
            <div className="grid grid-cols-1 gap-3">
              <Field label="첫 번째 줄" value={content.about.heroLine1} onChange={(v) => updateAbout({ heroLine1: v })} />
              <Field label="두 번째 줄" value={content.about.heroLine2} onChange={(v) => updateAbout({ heroLine2: v })} />
              <Field label="세 번째 줄" value={content.about.heroLine3} onChange={(v) => updateAbout({ heroLine3: v })} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6 space-y-5">
            <h2 className="font-bold text-[#1A1A1A]">본문</h2>
            <Field label="한국어 단락 1" value={content.about.bodyKo} onChange={(v) => updateAbout({ bodyKo: v })} multiline />
            <Field label="한국어 단락 2" value={content.about.bodyKo2} onChange={(v) => updateAbout({ bodyKo2: v })} multiline />
            <Field label="영문 단락" value={content.about.bodyEn} onChange={(v) => updateAbout({ bodyEn: v })} multiline />
          </div>

          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6">
            <h2 className="font-bold text-[#1A1A1A] mb-5">통계</h2>
            <div className="space-y-3">
              {content.about.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => {
                      const stats = [...content.about.stats];
                      stats[i] = { ...stat, value: Number(e.target.value) };
                      updateAbout({ stats });
                    }}
                    placeholder="숫자"
                    className="px-3 py-2 border border-[#E0E0DC] rounded-lg text-sm focus:outline-none focus:border-[#1A1A1A]"
                  />
                  <input
                    value={stat.suffix}
                    onChange={(e) => {
                      const stats = [...content.about.stats];
                      stats[i] = { ...stat, suffix: e.target.value };
                      updateAbout({ stats });
                    }}
                    placeholder="접미사 (+, %, 년+ 등)"
                    className="px-3 py-2 border border-[#E0E0DC] rounded-lg text-sm focus:outline-none focus:border-[#1A1A1A]"
                  />
                  <input
                    value={stat.label}
                    onChange={(e) => {
                      const stats = [...content.about.stats];
                      stats[i] = { ...stat, label: e.target.value };
                      updateAbout({ stats });
                    }}
                    placeholder="레이블"
                    className="px-3 py-2 border border-[#E0E0DC] rounded-lg text-sm focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#1A1A1A]">서비스 카드</h2>
              <button
                onClick={() =>
                  updateAbout({
                    serviceCards: [
                      ...content.about.serviceCards,
                      {
                        number: String(content.about.serviceCards.length + 1).padStart(2, "0"),
                        title: "",
                        description: "",
                        detail: "",
                      },
                    ],
                  })
                }
                className="text-xs font-semibold text-[#1A1A1A] border border-[#E0E0DC] px-3 py-1.5 rounded-lg hover:border-[#1A1A1A] transition-colors"
              >
                + 카드 추가
              </button>
            </div>
            <div className="space-y-4">
              {content.about.serviceCards.map((card, i) => (
                <div key={i} className="border border-[#F0F0EE] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#AAA]">카드 {card.number}</span>
                    <button
                      onClick={() => {
                        const serviceCards = content.about.serviceCards.filter((_, idx) => idx !== i);
                        updateAbout({ serviceCards });
                      }}
                      className="text-[#AAA] hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <input
                    value={card.title}
                    onChange={(e) => {
                      const serviceCards = [...content.about.serviceCards];
                      serviceCards[i] = { ...card, title: e.target.value };
                      updateAbout({ serviceCards });
                    }}
                    placeholder="제목"
                    className="w-full px-3 py-2 border border-[#E0E0DC] rounded-lg text-sm focus:outline-none focus:border-[#1A1A1A]"
                  />
                  <input
                    value={card.description}
                    onChange={(e) => {
                      const serviceCards = [...content.about.serviceCards];
                      serviceCards[i] = { ...card, description: e.target.value };
                      updateAbout({ serviceCards });
                    }}
                    placeholder="설명 (한 줄)"
                    className="w-full px-3 py-2 border border-[#E0E0DC] rounded-lg text-sm focus:outline-none focus:border-[#1A1A1A]"
                  />
                  <textarea
                    value={card.detail}
                    onChange={(e) => {
                      const serviceCards = [...content.about.serviceCards];
                      serviceCards[i] = { ...card, detail: e.target.value };
                      updateAbout({ serviceCards });
                    }}
                    placeholder="상세 설명"
                    rows={2}
                    className="w-full px-3 py-2 border border-[#E0E0DC] rounded-lg text-sm focus:outline-none focus:border-[#1A1A1A] resize-y"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SaveButton loading={loading} onClick={() => save("about")} />
            {saved === "about" && <span className="text-sm text-green-600 font-medium">저장되었습니다.</span>}
          </div>
        </div>
      )}

      {/* ── Contact ── */}
      {tab === "contact" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6 space-y-5">
            <h2 className="font-bold text-[#1A1A1A]">Contact 페이지</h2>
            <Field
              label="히어로 부제목"
              value={content.contact.heroSubtitle}
              onChange={(v) => updateContact({ heroSubtitle: v })}
              multiline
            />
            <Field
              label="주소 (줄바꿈은 Enter)"
              value={content.contact.address}
              onChange={(v) => updateContact({ address: v })}
              multiline
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="전화번호" value={content.contact.tel} onChange={(v) => updateContact({ tel: v })} placeholder="02-000-0000" />
              <Field label="팩스" value={content.contact.fax} onChange={(v) => updateContact({ fax: v })} placeholder="02-000-0000" />
              <Field label="웹사이트" value={content.contact.web} onChange={(v) => updateContact({ web: v })} placeholder="www.example.com" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SaveButton loading={loading} onClick={() => save("contact")} />
            {saved === "contact" && <span className="text-sm text-green-600 font-medium">저장되었습니다.</span>}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      {tab === "footer" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6 space-y-5">
            <h2 className="font-bold text-[#1A1A1A]">Footer</h2>
            <Field
              label="태그라인 (줄바꿈은 Enter)"
              value={content.footer.tagline}
              onChange={(v) => updateFooter({ tagline: v })}
              multiline
            />
            <Field
              label="주소"
              value={content.footer.address}
              onChange={(v) => updateFooter({ address: v })}
              multiline
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="전화번호" value={content.footer.tel} onChange={(v) => updateFooter({ tel: v })} />
              <Field label="팩스" value={content.footer.fax} onChange={(v) => updateFooter({ fax: v })} />
              <Field label="웹사이트" value={content.footer.web} onChange={(v) => updateFooter({ web: v })} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SaveButton loading={loading} onClick={() => save("footer")} />
            {saved === "footer" && <span className="text-sm text-green-600 font-medium">저장되었습니다.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
