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
  colors = ["#4f1b7a", "#1a3a6b", "#0d5c5c"],
  className = "",
}: Props) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Base background */}
      <div className="absolute inset-0" style={{ background: base }} />

      {/* Blob 1 — top-left */}
      <div
        className="absolute animate-blob-1"
        style={{
          top: "-15%",
          left: "-10%",
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background: colors[0],
          filter: "blur(100px)",
          opacity: 0.5,
        }}
      />

      {/* Blob 2 — top-right */}
      <div
        className="absolute animate-blob-2"
        style={{
          top: "10%",
          right: "-15%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background: colors[1],
          filter: "blur(110px)",
          opacity: 0.45,
        }}
      />

      {/* Blob 3 — bottom-center */}
      <div
        className="absolute animate-blob-3"
        style={{
          bottom: "-20%",
          left: "25%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background: colors[2],
          filter: "blur(120px)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
