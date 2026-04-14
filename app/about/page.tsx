import AnimatedSection from "@/components/ui/AnimatedSection";
import CountUp from "@/components/ui/CountUp";
import { readSiteContentAsync } from "@/lib/siteData";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us",
  description: "좋은 아이디어는 깊이 있는 인사이트에서 시작됩니다. SUPER Y 회사 소개.",
};

export default async function AboutPage() {
  const siteContent = await readSiteContentAsync();
  const { about } = siteContent;
  const h = about.heroSize ?? "md";
  const heroSize =
    h === "sm" ? "text-3xl md:text-5xl lg:text-6xl" :
    h === "lg" ? "text-5xl md:text-7xl lg:text-8xl" :
                 "text-4xl md:text-6xl lg:text-7xl";
  const bo = about.bodySize ?? "md";
  const bodySize =
    bo === "sm" ? "text-sm md:text-base" :
    bo === "lg" ? "text-lg md:text-xl" :
                  "text-base md:text-lg";

  return (
    <div className="pt-16 min-h-screen bg-[var(--bg-main)]">
      {/* Hero */}
      <section className="section-padding bg-[var(--bg-inverse)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-xs font-semibold tracking-[0.3em] text-white/40 uppercase mb-6">
              Who We Are
            </p>
            <h1 className={`${heroSize} font-bold text-white leading-tight tracking-tight mb-8`}>
              {about.heroLine1}<br />
              <span className="text-white/50">{about.heroLine2}</span><br />
              {about.heroLine3}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* About text */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection>
              <p className={`${bodySize} text-[var(--text-body)] leading-[2]`}>
                {about.bodyKo}
              </p>
              {about.bodyKo2 && (
                <p className={`${bodySize} text-[var(--text-body)] leading-[2] mt-6`}>
                  {about.bodyKo2}
                </p>
              )}
            </AnimatedSection>
            <AnimatedSection delay={0.15} direction="left">
              <p className="text-[var(--text-caption)] leading-[2] text-sm md:text-base italic">
                {about.bodyEn}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[var(--bg-card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {about.stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[var(--text-heading)] mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs font-semibold tracking-[0.2em] text-[var(--text-caption)] uppercase">
                  {stat.label}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--text-caption)] uppercase mb-4">
              What We Do
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-heading)]">
              Service Areas
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {about.serviceCards.map((service, i) => (
              <AnimatedSection key={service.number} delay={i * 0.07}>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--text-caption)] transition-colors group h-full">
                  <p className="text-xs font-semibold tracking-[0.2em] text-[var(--text-caption)] mb-4">
                    {service.number}
                  </p>
                  <h3 className="font-bold text-[var(--text-heading)] text-lg mb-2 group-hover:text-[var(--link-hover)] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[var(--text-caption)] mb-3">{service.description}</p>
                  <p className="text-sm text-[var(--text-body)] leading-relaxed">{service.detail}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
