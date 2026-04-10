import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-inverse)] text-[var(--text-on-inverse)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & tagline */}
          <div className="space-y-4">
            <Image
              src="https://res.cloudinary.com/deitwd6wh/image/upload/v1775798099/logo_light_nrjg4s.png"
              alt="SUPER Y"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              unoptimized
            />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              끊임없이 변화하는 멀티채널 환경에서<br />
              브랜드의 가치를 극대화합니다.
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase">Contact</h3>
            <address className="not-italic space-y-2 text-sm text-white/70">
              <p>Jobok Building 102, 201, 23, Nonhyeon-ro 135-gil,<br />Gangnam-gu, Seoul, Republic of Korea</p>
              <p>Tel. 02-540-3445 | Fax. 02-540-3443</p>
              <a href="http://www.supery.co.kr" className="hover:text-white transition-colors">
                www.supery.co.kr
              </a>
            </address>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase">Pages</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/project", label: "Project" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} SUPER Y. All rights reserved.
          </p>
          <div className="flex items-center gap-2 opacity-20">
            <Image
              src="https://cdn.imweb.me/upload/S202512290680c9aed9423/a42e3bfafbf89.png"
              alt=""
              width={60}
              height={20}
              className="h-5 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
