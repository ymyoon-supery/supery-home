import AnimatedSection from "@/components/ui/AnimatedSection";
import ContactForm from "@/components/ui/ContactForm";
import { readSiteContentAsync } from "@/lib/siteData";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "SUPER Y에 문의하세요. 마케팅 전략부터 캠페인, 브랜딩까지 함께 만들어 갑니다.",
};

export default async function ContactPage() {
  const siteContent = await readSiteContentAsync();
  const { contact } = siteContent;
  const addressLines = contact.address.split("\n");

  return (
    <div className="pt-16 min-h-screen bg-[var(--bg-main)]">
      {/* Hero */}
      <section className="section-padding pb-0 pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--text-caption)] uppercase mb-4">
              Get in Touch
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--text-heading)] leading-none tracking-tight mb-6">
              CONTACT
            </h1>
            <p className="text-[var(--text-body)] max-w-lg leading-relaxed">
              {contact.heroSubtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-[var(--border)] my-12" />
      </div>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Left: Info */}
            <div className="lg:col-span-2">
              <AnimatedSection className="space-y-10">
                {/* Address */}
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-[var(--text-caption)] uppercase mb-4">
                    Office
                  </h3>
                  <address className="not-italic text-[var(--text-body)] text-sm leading-loose">
                    {addressLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < addressLines.length - 1 && <br />}
                      </span>
                    ))}
                  </address>
                </div>

                {/* Contact details */}
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-[var(--text-caption)] uppercase mb-4">
                    Contact
                  </h3>
                  <div className="space-y-2 text-sm text-[var(--text-body)]">
                    <p>
                      <span className="text-[var(--text-caption)]">Tel.</span>{" "}
                      <a href={`tel:${contact.tel}`} className="hover:text-[var(--text-heading)] transition-colors">
                        {contact.tel}
                      </a>
                    </p>
                    <p>
                      <span className="text-[var(--text-caption)]">Fax.</span> {contact.fax}
                    </p>
                    <p>
                      <span className="text-[var(--text-caption)]">Web.</span>{" "}
                      <a href={`http://${contact.web}`} className="hover:text-[var(--text-heading)] transition-colors">
                        {contact.web}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Map embed */}
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-[var(--text-caption)] uppercase mb-4">
                    Location
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-[var(--border)] aspect-[4/3]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.4927392714!2d127.02780!3d37.51760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca15a4b9d6a65%3A0x5f5e6c4f4d2a3e8b!2s23+Nonhyeon-ro+135-gil%2C+Gangnam-gu%2C+Seoul!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="SUPER Y Office Location"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <AnimatedSection delay={0.15} direction="left">
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 md:p-10">
                  <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-8">
                    문의하기
                  </h2>
                  <ContactForm />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
