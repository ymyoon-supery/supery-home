import HeroSlider from "@/components/sections/HeroSlider";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import { getFeaturedProjectsFromData } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SUPER Y | 광고 마케팅 에이전시",
  description: "GOOD IDEA는 좋은 인사이트에서 출발합니다. 브랜드의 가치를 극대화하는 마케팅 해답을 제시합니다.",
};

export default async function HomePage() {
  const featured = await getFeaturedProjectsFromData();
  const slides = featured.slice(0, 5);

  return (
    <>
      <HeroSlider slides={slides} />
      <ServicesSection />
      <PortfolioPreview projects={featured} />
    </>
  );
}
