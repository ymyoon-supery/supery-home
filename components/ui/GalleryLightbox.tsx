"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MediaItem } from "@/lib/projects";

// Cloudinary URL에 변환 파라미터 삽입 (비-Cloudinary URL은 그대로)
function cldUrl(url: string, transform: string): string {
  if (!url?.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}

interface Props {
  mediaList: MediaItem[];  // 전체 미디어 (대표 포함)
  coverIndex: number;      // 대표 항목 인덱스
  projectTitle: string;
  projectImage: string;    // 대표 이미지 URL (히어로 표시용)
}

export default function GalleryLightbox({ mediaList, coverIndex, projectTitle, projectImage }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const prev = useCallback(() =>
    setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);

  const next = useCallback(() =>
    setActiveIndex((i) => (i !== null && i < mediaList.length - 1 ? i + 1 : i)),
  [mediaList.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, prev, next]);

  const activeItem = activeIndex !== null ? mediaList[activeIndex] : null;

  const coverItem = mediaList[coverIndex];

  return (
    <>
      {/* 히어로 — 클릭 시 라이트박스 */}
      <div
        onClick={() => setActiveIndex(coverIndex)}
        className="cursor-pointer"
      >
        {coverItem?.type === "youtube" ? (
          <div className="w-full aspect-video rounded-3xl overflow-hidden bg-[var(--bg-card)] relative group">
            <img
              src={`https://img.youtube.com/vi/${coverItem.videoId}/maxresdefault.jpg`}
              alt={projectTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-[var(--bg-card)] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldUrl(projectImage, "w_1200,q_auto,f_auto")}
              alt={projectTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 썸네일 그리드 — 대표 항목 제외 */}
      {mediaList.length > 1 && (
        <div className="mt-12">
          <div className="h-px bg-[var(--border)] mb-12" />
          <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--text-caption)] uppercase mb-6">
            Gallery
          </h2>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mediaList.map((item, realIndex) => {
          if (realIndex === coverIndex) return null;
          return (
            <div
              key={realIndex}
              onClick={() => setActiveIndex(realIndex)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--bg-card)] cursor-pointer group"
            >
              {item.type === "youtube" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                  alt={`${projectTitle} ${realIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : item.type === "video" ? (
                <video src={item.url} className="w-full h-full object-cover" muted playsInline />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={cldUrl(item.url, "w_800,q_auto,f_auto")}
                  alt={`${projectTitle} ${realIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}

              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                {(item.type === "youtube" || item.type === "video") ? (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center opacity-90 ${item.type === "youtube" ? "bg-red-600" : "bg-black/70"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 라이트박스 */}
      {activeItem !== null && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          {/* 닫기 */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 이전 */}
          {activeIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* 다음 */}
          {activeIndex < mediaList.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* 콘텐츠 */}
          <div
            className="relative max-w-5xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {activeItem.type === "youtube" ? (
              <div className="w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${activeItem.videoId}?autoplay=1`}
                  title={projectTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-2xl"
                />
              </div>
            ) : activeItem.type === "video" ? (
              <video
                src={activeItem.url}
                controls
                autoPlay
                className="max-h-[85vh] w-full rounded-2xl"
                playsInline
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cldUrl(activeItem.url, "w_1920,q_auto,f_auto")}
                alt={`${projectTitle} ${activeIndex + 1}`}
                className="max-h-[85vh] max-w-full w-auto object-contain rounded-2xl"
              />
            )}
          </div>

          {/* 인디케이터 */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {mediaList.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
