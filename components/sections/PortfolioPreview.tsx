import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Project } from "@/lib/projects";

interface Props {
  projects: Project[];
}

export default function PortfolioPreview({ projects }: Props) {
  const featured = projects.slice(0, 6);

  return (
    <section className="section-padding bg-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--text-caption)] uppercase mb-4">
              Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-heading)]">
              Latest Works
            </h2>
          </div>
          <Link
            href="/project"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[var(--text-heading)] border-b border-[var(--border)] pb-1 hover:border-[var(--text-heading)] transition-colors self-start md:self-auto"
          >
            전체 보기
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </AnimatedSection>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((project, i) => (
            <AnimatedSection
              key={project.id}
              delay={i * 0.08}
              className={i === 0 ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <Link href={`/project/${project.id}`} className="group block relative overflow-hidden rounded-2xl bg-[var(--bg-main)] aspect-[4/3]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-2">
                    {project.categoryLabel}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-snug">{project.title}</h3>
                  {project.description && (
                    <p className="text-white/70 text-sm mt-1">{project.description}</p>
                  )}
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
