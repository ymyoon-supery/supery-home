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

      {/* Hero + Gallery + Lightbox */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
        <GalleryLightbox
          mediaList={mediaList}
          coverIndex={effectiveCoverIndex}
          projectTitle={project.title}
          projectImage={project.image}
        />
      </AnimatedSection>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <AnimatedSection>
          <p className="text-xs font-semibold tracking-[0.3em] text-[var(--text-caption)] uppercase mb-4">
            {project.categoryLabel}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-heading)] leading-tight mb-6">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-[var(--text-body)] text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          )}
        </AnimatedSection>

        {/* Media gallery — GalleryLightbox 내부에 포함됨 */}

        {/* Divider */}
        <div className="h-px bg-[var(--border)] my-12" />

        {/* Related projects */}
        <AnimatedSection>
          <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--text-caption)] uppercase mb-8">
            같은 카테고리 프로젝트
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects
              .filter((p) => p.category === project.category && p.id !== project.id)
              .slice(0, 2)
              .map((related) => (
                <Link
                  key={related.id}
                  href={`/project/${related.id}`}
                  className="group block relative overflow-hidden rounded-2xl bg-[var(--bg-card)] aspect-[4/3]"
                >
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white font-semibold text-sm">{related.title}</p>
                  </div>
                </Link>
              ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
