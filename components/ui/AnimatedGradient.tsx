"use client";

interface Props {
  /** 배경 베이스 색상 (기본: 검정) */
  base?: string;
  /** 블롭 색상 3개 [색1, 색2, 색3] */
  colors?: [string, string, string];
  className?: string;
}

export default function AnimatedGradient({
  base = "#0a0a0a",
  colors = ["#7c3aed", "#2563eb", "#0891b2"],
  className = "",
}: Props) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Base background */}
      <div className="absolute inset-0" style={{ background: base }} />

      {/* Blob 1 — top-left (보라) */}
      <div
        className="absolute animate-blob-1"
        style={{
          top: "-5%",
          left: "-5%",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background: colors[0],
          filter: "blur(60px)",
          opacity: 0.75,
        }}
      />

      {/* Blob 2 — top-right (파랑) */}
      <div
        className="absolute animate-blob-2"
        style={{
          top: "5%",
          right: "-5%",
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background: colors[1],
          filter: "blur(70px)",
          opacity: 0.65,
        }}
      />

      {/* Blob 3 — bottom-center (청록) */}
      <div
        className="absolute animate-blob-3"
        style={{
          bottom: "-10%",
          left: "20%",
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background: colors[2],
          filter: "blur(65px)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
