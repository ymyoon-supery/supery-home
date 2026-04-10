import ProjectGrid from "@/components/ui/ProjectGrid";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { categoryLabels, type Category } from "@/lib/projects";
import { readProjects } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project",
  description: "SUPER Y의 포트폴리오 — SNS 운영, 캠페인, 인플루언서 마케팅, 영상 제작, 브랜딩, 커머스까지.",
};

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ProjectPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const initialCategory: Category =
    cat && cat in categoryLabels ? (cat as Category) : "all";
  const allProjects = readProjects();

  const heading =
    initialCategory === "all"
      ? "PROJECT"
      : categoryLabels[initialCategory];

  return (
    <div className="pt-16 min-h-screen bg-[var(--bg-main)]">
      {/* Hero */}
      <section className="section-padding pb-0 pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--text-caption)] uppercase mb-4">
              Our Work
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-heading)] leading-tight tracking-tight mb-6">
              {heading}
            </h1>
            <p className="text-[var(--text-body)] max-w-xl leading-relaxed">
              브랜드의 성장을 함께한 프로젝트들을 소개합니다.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-[var(--border)] my-12" />
      </div>

      {/* Portfolio Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ProjectGrid key={initialCategory} initialCategory={initialCategory} allProjects={allProjects} />
        </div>
      </section>
    </div>
  );
}
