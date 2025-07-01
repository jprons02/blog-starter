"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/app/components/layout/ToggleButtonLightDark";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/app/hooks/useModal";

// Unified array with link and modal items
type NavItem =
  | { label: string; href: string; type: "link" }
  | { label: string; modal: "benefit"; type: "modal" };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", type: "link" },
  { label: "Browse by Tags", href: "/tags", type: "link" },
  { label: "Check Benefits", modal: "benefit", type: "modal" },
  { label: "About", href: "/about", type: "link" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
  }, [isLight]);

  return (
    <nav
      style={{ color: "var(--color-foreground)" }}
      className="w-full top-0 z-40"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold hover:opacity-90 transition"
          style={{ color: "var(--color-primary)", lineHeight: "0" }}
        >
          <Image
            src={
              isLight ? "/logo/blog_logo_dark.svg" : "/logo/blog_logo_light.svg"
            }
            alt="Blog Logo"
            width={36}
            height={36}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.type === "link" ? (
                  <Link
                    href={item.href!}
                    className="relative pb-1 border-b-2 border-transparent transition-colors duration-200 hover:border-[var(--color-foreground)]"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    onClick={() => openModal(item.modal!)}
                    className="cursor-pointer relative pb-1 border-b-2 border-transparent transition-colors duration-200 hover:border-[var(--color-foreground)]"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <ThemeToggle isLight={isLight} setIsLight={setIsLight} />
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <ThemeToggle isLight={isLight} setIsLight={setIsLight} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded transition"
            style={{ backgroundColor: "transparent" }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div
              className="px-4 py-4 space-y-3 text-center"
              style={{
                backgroundColor: "var(--color-muted-bg)",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {NAV_ITEMS.map((item) =>
                item.type === "link" ? (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="block font-medium transition"
                    style={{
                      color: "var(--color-muted-text)",
                      fontSize: "1.2rem",
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    key={item.label}
                    onClick={() => {
                      openModal(item.modal!);
                      setIsOpen(false);
                    }}
                    className="block font-medium transition cursor-pointer"
                    style={{
                      color: "var(--color-muted-text)",
                      fontSize: "1.2rem",
                    }}
                  >
                    {item.label}
                  </span>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
