import AnimatedSection from "@/components/ui/AnimatedSection";
import CountUp from "@/components/ui/CountUp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "좋은 아이디어는 깊이 있는 인사이트에서 시작됩니다. SUPER Y 회사 소개.",
};

const services = [
  {
    number: "01",
    title: "SNS Management",
    description: "SNS 채널 전략 수립 및 콘텐츠 운영",
    detail: "브랜드에 최적화된 SNS 채널 전략을 수립하고, 일관성 있는 콘텐츠를 지속적으로 운영합니다.",
  },
  {
    number: "02",
    title: "Campaign",
    description: "브랜드 캠페인 기획 및 실행",
    detail: "브랜드 목표에 맞는 캠페인을 기획하고 멀티채널에서 통합 실행합니다.",
  },
  {
    number: "03",
    title: "Influencer Marketing",
    description: "인플루언서 매칭 및 협업 마케팅",
    detail: "브랜드 이미지에 부합하는 인플루언서를 선별하고 효과적인 협업을 진행합니다.",
  },
  {
    number: "04",
    title: "Total Maintenance",
    description: "디지털 마케팅 통합 운영",
    detail: "SEO, SEM, SNS, 콘텐츠 마케팅을 통합 운영하여 브랜드 디지털 존재감을 강화합니다.",
  },
  {
    number: "05",
    title: "Digital Film",
    description: "영상 콘텐츠 기획 및 제작",
    detail: "브랜드 스토리를 담은 고품질 영상 콘텐츠를 기획부터 제작까지 원스톱으로 제공합니다.",
  },
  {
    number: "06",
    title: "Consulting & Branding",
    description: "브랜드 컨설팅 및 전략 수립",
    detail: "브랜드의 본질을 분석하고 장기적인 브랜드 전략과 아이덴티티를 수립합니다.",
  },
  {
    number: "07",
    title: "Commerce",
    description: "커머스 마케팅 및 퍼포먼스 운영",
    detail: "데이터 기반의 퍼포먼스 마케팅으로 커머스 매출과 ROAS를 극대화합니다.",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Projects" },
  { value: 200, suffix: "+", label: "Brands" },
  { value: 10, suffix: "년+", label: "Experience" },
  { value: 98, suffix: "%", label: "Satisfaction" },
];

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen bg-[var(--bg-main)]">
      {/* Hero */}
      <section className="section-padding bg-[var(--bg-inverse)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-xs font-semibold tracking-[0.3em] text-white/40 uppercase mb-6">
              Who We Are
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              GOOD IDEA<br />
              <span className="text-white/50">STARTS WITH</span><br />
              GOOD INSIGHT
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* About text */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection>
              <p className="text-[var(--text-body)] leading-[2] text-base md:text-lg">
                좋은 아이디어는 깊이 있는 인사이트에서 시작됩니다. 우리는 브랜드의 본질을 꿰뚫는
                통찰력을 바탕으로 급변하는 마케팅 환경에 최적화된 해답을 제시합니다. 데이터 기반의
                정교한 분석과 창의적인 전략을 결합하여 소비자의 숨은 니즈를 파악하고, 단순한 제작을
                넘어 브랜드의 실질적인 성장을 견인하는 실용적인 솔루션을 설계합니다.
              </p>
              <p className="text-[var(--text-body)] leading-[2] text-base md:text-lg mt-6">
                소비자와 소통하고 공유하는 모든 접점을 하나의 의미 있는 콘텐츠로 정의하며, 진정성 있는
                메시지를 통해 브랜드와 소비자 사이의 깊은 신뢰와 유대감을 구축합니다.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.15} direction="left">
              <p className="text-[var(--text-caption)] leading-[2] text-sm md:text-base italic">
                Based on deep insights into brand essence and consumer needs, we provide creative and
                practical solutions optimized for the rapidly changing digital environment. By combining
                data-driven analysis with strategic thinking, we design every touchpoint as authentic
                content. We build sustainable growth and trust through meaningful connections, helping
                our clients advance toward a more innovative vision.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[var(--bg-card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
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
            {services.map((service, i) => (
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
