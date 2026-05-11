"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";

interface Props {
  slides: Project[];
}

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1: next, -1: prev
  const count = slides?.length ?? 0;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    if (count === 0) return;
    const nextIndex = (current + 1) % count;
    setDirection(1);
    setCurrent(nextIndex);
  }, [current, count]);

  const prev = useCallback(() => {
    if (count === 0) return;
    setDirection(-1);
    setCurrent((current - 1 + count) % count);
  }, [current, count]);

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) next();
    else prev();
  }, [next, prev]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (count === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, count]);

  if (count === 0) return null;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section
      className="relative w-full h-svh min-h-[500px] overflow-hidden bg-[#111]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0, 0.67, 0] }}
          className="absolute inset-0"
        >
          {/* Desktop image */}
          <Image
            src={slides[current].heroImage || slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover hidden md:block"
            priority={current === 0}
            sizes="(min-width: 768px) 100vw, 0vw"
          />
          {/* Mobile image — heroImageMobile if set, otherwise falls back to representative image */}
          <Image
            src={slides[current].heroImageMobile || slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover md:hidden"
            priority={current === 0}
            sizes="(max-width: 767px) 100vw, 0vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-3">
                {slides[current].categoryLabel}
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 max-w-2xl">
                {slides[current].title}
              </h2>
              {slides[current].description && (
                <p className="hidden md:block text-white/65 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                  {slides[current].description}
                </p>
              )}
              <Link
                href={`/project/${slides[current].id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1A1A1A] font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators + arrows */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative h-0.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === current ? 40 : 20, background: "rgba(255,255,255,0.3)" }}
          >
            {i === current && (
              <motion.span
                className="absolute inset-0 bg-white rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Slide counter */}
      <div className="absolute top-20 right-6 md:right-8 z-20 text-right">
        <span className="text-white font-bold text-xl leading-none">{String(current + 1).padStart(2, "0")}</span>
        <span className="text-white/30 text-sm"> / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
