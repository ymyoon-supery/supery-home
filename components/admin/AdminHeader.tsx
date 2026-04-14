"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogout from "@/components/admin/AdminLogout";

export default function AdminHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/projects", label: "프로젝트" },
    { href: "/admin/site", label: "사이트 콘텐츠" },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="bg-white border-b border-[#E0E0DC] sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin">
            <Image
              src="https://cdn.imweb.me/thumbnail/20260225/b46c0438a299b.png"
              alt="SUPER Y"
              width={90}
              height={28}
              className="h-6 w-auto object-contain"
              unoptimized
            />
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#777] hover:text-[#1A1A1A] hover:bg-[#F5F5F3]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-xs text-[#777] hover:text-[#1A1A1A] transition-colors">
            사이트 보기 ↗
          </Link>
          <AdminLogout />
        </div>
      </div>
    </header>
  );
}
