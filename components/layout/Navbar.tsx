"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedProperties } from "@/lib/useSavedProperties";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Properties" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const savedCount = useSavedProperties().ids.length;

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isTransparent = isHomePage && !scrolled && !mobileOpen;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pt-3">
      <nav
        className={`max-w-7xl mx-auto h-16 pl-3 pr-2 sm:pl-4 flex items-center justify-between rounded-full transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "bg-white/85 backdrop-blur-xl border border-line shadow-soft"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span
            className={`rounded-full transition-all duration-300 ${
              isTransparent ? "bg-white px-3 py-1" : ""
            }`}
          >
            <Image
              src="/logo.jpeg"
              alt="MG Reliance Property Developers"
              width={140}
              height={56}
              className="h-9 w-auto object-contain"
              priority
            />
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative isolate block px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isTransparent
                      ? active
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                      : active
                        ? "text-text-main"
                        : "text-text-secondary hover:text-text-main"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className={`absolute inset-0 -z-10 rounded-full ${
                        isTransparent ? "bg-white/15" : "bg-background"
                      }`}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Saved */}
          <Link
            href="/saved"
            aria-label={`Saved properties${savedCount ? ` (${savedCount})` : ""}`}
            className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isTransparent ? "text-white hover:bg-white/10" : "text-text-main hover:bg-background"
            }`}
          >
            <Heart size={19} className={pathname === "/saved" ? "fill-current" : ""} />
            <AnimatePresence>
              {savedCount > 0 && (
                <motion.span
                  key={savedCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center tabular-nums"
                >
                  {savedCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* CTA */}
          <Link
            href="/contact"
            className={`hidden lg:inline-flex btn py-2.5 ${isTransparent ? "btn-light" : "btn-primary"}`}
          >
            Get started
            <ArrowUpRight size={15} />
          </Link>

          {/* Mobile Hamburger */}
          <button
            className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isTransparent ? "text-white hover:bg-white/10" : "text-text-main hover:bg-background"
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden max-w-7xl mx-auto mt-2 bg-white rounded-3xl border border-line shadow-soft"
          >
            <ul className="p-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-2xl text-[15px] font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-background text-text-main"
                        : "text-text-secondary hover:text-text-main"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/contact" className="btn btn-primary w-full">
                  Get started
                  <ArrowUpRight size={15} />
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
