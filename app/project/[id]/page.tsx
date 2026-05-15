import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { categoryLabels } from "@/lib/projects";
import { readProjectsAsync, getProjectByIdFromData } from "@/lib/data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GalleryLightbox from "@/components/ui/GalleryLightbox";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectByIdFromData(id);
  if (!project) return { title: "Project Not Found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectByIdFromData(id);
  if (!project) notFound();
  const projects = await readProjectsAsync();

  const mediaList = (project.media?.length
    ? project.media
    : [{ url: project.image, type: "image" as const }]
  ).filter(Boolean);

  // 같은 카테고리 내 이전·다음 프로젝트 (순환)
  const sameCategory = projects.filter((p) => p.category === project.category);
  const currentIdx = sameCategory.findIndex((p) => p.id === project.id);
  const hasSiblings = sameCategory.length >= 2;
  const prevProject = hasSiblings
    ? sameCategory[(currentIdx - 1 + sameCategory.length) % sameCategory.length]
    : null;
  const nextProject = hasSiblings
    ? sameCategory[(currentIdx + 1) % sameCategory.length]
    : null;
  // 카테고리에 프로젝트가 2개뿐이면 prev === next → 하나만 표시
  const siblingPair =
    prevProject && nextProject && prevProject.id !== nextProject.id
      ? [
          { project: prevProject, label: "이전 프로젝트" },
          { project: nextProject, label: "다음 프로젝트" },
        ]
      : nextProject
      ? [{ project: nextProject, label: "다음 프로젝트" }]
      : [];

  // 대표 항목 식별: YouTube는 URL에서 videoId 추출 후 project.image와 비교
  const coverIdx = mediaList.findIndex((item) => {
    if (item.type === "youtube") {
      const vid = item.videoId ??
        item.url?.match(/(?:youtu\.be\/|shorts\/|[?&]v=)([^&\n?#]+)/)?.[1];
      if (!vid) return false;
      return project.image.includes(`/vi/${vid}/`);
    }
    return item.url === project.image;
  });
  const effectiveCoverIndex = coverIdx >= 0 ? coverIdx : 0;
  const coverItem = mediaList[effectiveCoverIndex];
  const galleryItems = mediaList.filter((_, i) => i !== effectiveCoverIndex);

  return (
    <div className="pt-16 min-h-screen bg-[var(--bg-main)]">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12">
        <Link
          href={`/project?cat=${project.category}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-heading)] opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          {categoryLabels[project.category]}
        </Link>
      </div>

      {/* 대표이미지 — PC: heroImage, 모바일: heroImageMobile, 미등록 시 image */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
        <div className="relative w-full aspect-[4/5] md:aspect-[16/9] rounded-2xl overflow-hidden bg-[var(--bg-card)]">
          {/* PC */}
          <Image
            src={project.heroImage || project.image}
            alt={project.title}
            fill
            className="object-cover hidden md:block"
            priority
            sizes="(min-width: 768px) 80vw, 0vw"
          />
          {/* Mobile */}
          <Image
            src={project.imageMobile || project.heroImageMobile || project.image}
            alt={project.title}
            fill
            className="object-cover md:hidden"
            priority
            sizes="(max-width: 767px) 100vw, 0vw"
          />
        </div>
      </AnimatedSection>

      {/* 카테고리 · 제목 · 설명 */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-8 pb-4">
        <AnimatedSection>
          <p className="text-xs font-semibold tracking-[0.3em] text-[var(--text-caption)] uppercase mb-4">
            {project.categoryLabel}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-heading)] leading-tight mb-6">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-[var(--text-body)] text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          )}
        </AnimatedSection>
      </div>

      {/* Gallery */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
        <GalleryLightbox
          mediaList={mediaList}
          coverIndex={effectiveCoverIndex}
          projectTitle={project.title}
          projectImage={project.image}
          hideCover
        />
      </AnimatedSection>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Divider */}
        <div className="h-px bg-[var(--border)] my-12" />

        {/* Prev / Next in same category */}
        {siblingPair.length > 0 && (
          <AnimatedSection>
            <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--text-caption)] uppercase mb-8">
              같은 카테고리 프로젝트
            </h2>
            <div className={`grid gap-4 ${siblingPair.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-1 sm:grid-cols-2"}`}>
              {siblingPair.map(({ project: related, label }) => (
                <Link
                  key={related.id}
                  href={`/project/${related.id}`}
                  className="group block relative overflow-hidden rounded-2xl bg-[var(--bg-card)] aspect-[4/3]"
                >
                  {/* Mobile image */}
                  <Image
                    src={related.imageMobile || related.heroImageMobile || related.image}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 md:hidden"
                    sizes="(max-width: 767px) 100vw, 0px"
                  />
                  {/* Desktop image */}
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 hidden md:block"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/55 transition-all duration-300" />
                  {/* 항상 표시되는 레이블 + 제목 */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">
                      {label}
                    </p>
                    <p className="text-white font-semibold text-sm leading-snug">
                      {related.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
