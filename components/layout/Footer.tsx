import Image from "next/image";
import Link from "next/link";
import { readSiteContentAsync } from "@/lib/siteData";

export default async function Footer() {
  const siteContent = await readSiteContentAsync();
  const { footer } = siteContent;
  const taglineLines = footer.tagline.split("\n");
  const addressLines = footer.address.split("\n");

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
              {taglineLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < taglineLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase">Contact</h3>
            <address className="not-italic space-y-2 text-sm text-white/70">
              <p>
                {addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <p>Tel. {footer.tel} | Fax. {footer.fax}</p>
              <a href={`http://${footer.web}`} className="hover:text-white transition-colors">
                {footer.web}
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
