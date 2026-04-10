"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

export default function GradientHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  // 각 블롭마다 다른 속도·방향으로 parallax
  const b1x = useTransform(springX, [0, 1], ["-15%", "15%"]);
  const b1y = useTransform(springY, [0, 1], ["-15%", "15%"]);
  const b2x = useTransform(springX, [0, 1], ["10%", "-10%"]);
  const b2y = useTransform(springY, [0, 1], ["10%", "-10%"]);
  const b3x = useTransform(springX, [0, 1], ["-8%", "12%"]);
  const b3y = useTransform(springY, [0, 1], ["8%", "-12%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Mouse-reactive gradient blobs */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">

        {/* Blob 1 — 보라 (top-left) */}
        <motion.div
          style={{
            position: "absolute",
            top: "-5%", left: "-5%",
            width: "60%", height: "60%",
            borderRadius: "50%",
            background: "#7c3aed",
            filter: "blur(80px)",
            opacity: 0.45,
            x: b1x, y: b1y,
          }}
        />

        {/* Blob 2 — 파랑 (top-right) */}
        <motion.div
          style={{
            position: "absolute",
            top: "5%", right: "-5%",
            width: "55%", height: "55%",
            borderRadius: "50%",
            background: "#2563eb",
            filter: "blur(90px)",
            opacity: 0.4,
            x: b2x, y: b2y,
          }}
        />

        {/* Blob 3 — 청록 (bottom-center) */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "-10%", left: "20%",
            width: "55%", height: "55%",
            borderRadius: "50%",
            background: "#0891b2",
            filter: "blur(85px)",
            opacity: 0.45,
            x: b3x, y: b3y,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs font-semibold tracking-[0.4em] text-white/40 uppercase mb-6"
        >
          Marketing Agency
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mb-8"
        >
          <Image
            src="https://res.cloudinary.com/deitwd6wh/image/upload/v1775807828/Logo_white_dia_wfd3jw.png"
            alt="SUPER Y"
            width={480}
            height={120}
            className="mx-auto w-44 md:w-[268px] lg:w-[336px] h-auto object-contain"
            unoptimized
            priority
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/50 text-base md:text-lg max-w-md mx-auto leading-relaxed"
        >
          GOOD IDEA는 좋은 인사이트에서 출발합니다.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
