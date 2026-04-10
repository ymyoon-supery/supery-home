"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ui/ThemeProvider";
import Image from "next/image";

const projectSubMenu = [
  { href: "/project", label: "ALL" },
  { href: "/project?cat=sns-management", label: "SNS MANAGEMENT" },
  { href: "/project?cat=campaign", label: "CAMPAIGN" },
  { href: "/project?cat=influencer-marketing", label: "INFLUENCER MARKETING" },
  { href: "/project?cat=total-maintenance", label: "TOTAL MAINTENANCE" },
  { href: "/project?cat=digital-film", label: "DIGITAL FILM" },
  { href: "/project?cat=consulting-branding", label: "CONSULTING & BRANDING" },
  { href: "/project?cat=commerce", label: "COMMERCE" },
];

const navLinks = [
  { href: "/", label: "HOME", sub: null },
  { href: "/project", label: "PROJECT", sub: projectSubMenu },
  { href: "/about", label: "ABOUT US", sub: null },
  { href: "/contact", label: "CONTACT", sub: null },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProjectOpen, setMobileProjectOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setMobileProjectOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const isHome = pathname === "/";
  const isProject = pathname.startsWith("/project");
  // 어두운 배경일 때: 흰색 로고(다이아몬드 컬러 유지 + 텍스트 흰색)
  // 밝은 배경일 때: 컬러 로고
  const logoSrc =
    (isHome && !scrolled && !menuOpen) || theme === "dark"
      ? "https://cdn.imweb.me/thumbnail/20260225/6476e15768ae7.png"
      : "https://cdn.imweb.me/thumbnail/20260225/b46c0438a299b.png";

  const navTextClass = (active: boolean) =>
    isHome && !scrolled
      ? active
        ? "text-white font-semibold"
        : "text-white/70 hover:text-white"
      : active
      ? "text-[var(--text-heading)] font-semibold"
      : "text-[var(--text-heading)] opacity-60 hover:opacity-100";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-sm"
            : isHome
            ? "bg-transparent"
            : "bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logoSrc}
              alt="SUPER Y"
              width={120}
              height={36}
              className="h-8 w-auto object-contain transition-opacity duration-300"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.sub ? (
                /* PROJECT — dropdown trigger */
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className={`flex items-center gap-1 text-sm font-medium tracking-widest transition-colors duration-200 ${navTextClass(
                      isProject
                    )}`}
                  >
                    {link.label}
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </motion.svg>
                  </button>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full right-0 mt-3 w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden py-2"
                      >
                        {link.sub.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setDropdownOpen(false)}
                            className="block px-5 py-2.5 text-xs font-semibold tracking-widest text-[var(--text-heading)] opacity-70 hover:opacity-100 hover:bg-[var(--bg-main)] transition-all"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Normal nav item */
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-widest transition-colors duration-200 ${navTextClass(
                    pathname === link.href
                  )}`}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                isHome && !scrolled
                  ? "text-white/70 hover:text-white"
                  : "text-[var(--text-heading)] opacity-60 hover:opacity-100"
              }`}
            >
              {theme === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`w-8 h-8 flex items-center justify-center transition-colors ${
                isHome && !scrolled && !menuOpen ? "text-white/70" : "text-[var(--text-heading)] opacity-70"
              }`}
            >
              {theme === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className={`w-8 h-8 flex flex-col items-center justify-center gap-1.5 transition-colors ${
                isHome && !scrolled && !menuOpen ? "text-white" : "text-[var(--text-heading)]"
              }`}
            >
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--bg-main)] flex flex-col items-center justify-center overflow-y-auto py-24"
          >
            <nav className="flex flex-col items-center gap-6 w-full px-8">
              {navLinks.map((link, i) =>
                link.sub ? (
                  /* PROJECT with accordion */
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex flex-col items-center w-full max-w-xs"
                  >
                    <button
                      onClick={() => setMobileProjectOpen((v) => !v)}
                      className={`flex items-center gap-2 text-3xl font-bold tracking-widest transition-colors ${
                        isProject ? "text-[var(--text-heading)]" : "text-[var(--text-heading)] opacity-50"
                      }`}
                    >
                      {link.label}
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                        animate={{ rotate: mobileProjectOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {mobileProjectOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden mt-4 w-full"
                        >
                          <div className="flex flex-col items-center gap-3 border-t border-[var(--border)] pt-4">
                            {link.sub.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => {
                                  setMenuOpen(false);
                                  setMobileProjectOpen(false);
                                }}
                                className="text-sm font-semibold tracking-widest text-[var(--text-heading)] opacity-60 hover:opacity-100 transition-opacity"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      className={`text-3xl font-bold tracking-widest transition-colors ${
                        pathname === link.href
                          ? "text-[var(--text-heading)]"
                          : "text-[var(--text-heading)] opacity-50 hover:opacity-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
