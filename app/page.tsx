import GradientHero from "@/components/sections/GradientHero";
import HeroSlider from "@/components/sections/HeroSlider";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import { getFeaturedProjectsFromData, readProjectsAsync } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SUPER Y | 광고 마케팅 에이전시",
  description: "GOOD IDEA는 좋은 인사이트에서 출발합니다. 브랜드의 가치를 극대화하는 마케팅 해답을 제시합니다.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const featured = await getFeaturedProjectsFromData();
    const allProjects = featured.length > 0 ? featured : await readProjectsAsync();
    const slides = allProjects.slice(0, 5);

    return (
      <>
        <GradientHero />
        <HeroSlider slides={slides} />
        <ServicesSection />
        <PortfolioPreview projects={allProjects.slice(0, 6)} />
      </>
    );
  } catch (err) {
    return (
      <div style={{ padding: 40, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        <h2>Homepage Error (debug)</h2>
        <p>{String(err)}</p>
        {err instanceof Error && <p>{err.stack}</p>}
      </div>
    );
  }
}
