"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { categories, categoryLabels, type Category, type Project } from "@/lib/projects";

interface ProjectGridProps {
  initialCategory?: Category;
  allProjects: Project[];
}

export default function ProjectGrid({ initialCategory = "all", allProjects }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);

  const filtered = activeCategory === "all"
    ? allProjects
    : allProjects.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[var(--btn-bg)] text-[var(--btn-text)]"
                  : "bg-[var(--bg-card)] text-[var(--text-caption)] border border-[var(--border)] hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>


      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/project/${project.id}`}
                className="group block relative overflow-hidden rounded-2xl bg-[var(--bg-main)] aspect-[4/3]"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[10px] font-semibold tracking-widest text-white/60 uppercase mb-2">
                    {project.categoryLabel}
                  </span>
                  <h3 className="text-white font-bold text-lg">{project.title}</h3>
                  {project.description && (
                    <p className="text-white/70 text-sm mt-1">{project.description}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-[var(--text-caption)]">
          준비 중인 프로젝트입니다.
        </div>
      )}
    </div>
  );
}
