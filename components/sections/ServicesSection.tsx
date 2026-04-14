import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { SiteContent } from "@/lib/siteContent";

interface Props {
  content: SiteContent["services"];
}

export default function ServicesSection({ content }: Props) {
  const titleLines = content.title.split("\n");

  return (
    <section className="section-padding bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: text */}
          <div>
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-[0.3em] text-[var(--text-caption)] uppercase mb-6">
                Services
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-heading)] leading-tight mb-6">
                {titleLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h2>
              <p className="text-[var(--text-body)] leading-relaxed mb-10 max-w-md">
                {content.body}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/project"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--btn-bg)] text-[var(--btn-text)] text-sm font-semibold tracking-widest uppercase rounded-full hover:opacity-80 transition-opacity"
                >
                  MORE VIEW
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                {content.downloadUrl && content.downloadUrl !== "#" ? (
                  <a
                    href={content.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] text-[var(--text-heading)] text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-[var(--bg-card)] transition-colors"
                  >
                    회사소개서 다운로드
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </a>
                ) : (
                  <a
                    href={content.downloadUrl || "#"}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] text-[var(--text-heading)] text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-[var(--bg-card)] transition-colors"
                  >
                    회사소개서 다운로드
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </a>
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Right: service list */}
          <div>
            <div className="divide-y divide-[var(--border)]">
              {content.items.map((service, i) => (
                <AnimatedSection key={service.label || i} delay={i * 0.07}>
                  <Link
                    href="/project"
                    className="group flex items-center justify-between py-5 hover:pl-4 transition-all duration-200"
                  >
                    <div>
                      <p className="font-semibold text-[var(--text-heading)] group-hover:text-[var(--link-hover)] transition-colors">
                        {service.label}
                      </p>
                      <p className="text-sm text-[var(--text-caption)] mt-1">{service.desc}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[var(--text-caption)] group-hover:text-[var(--text-heading)] group-hover:translate-x-1 transition-all">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
