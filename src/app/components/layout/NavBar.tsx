"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/app/components/layout/ToggleButtonLightDark";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/app/hooks/useModal";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Tags", href: "/tags" },
  { label: "About", href: "/about" },
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
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-colors duration-200"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {label}
                </Link>
              </li>
            ))}
            {/* Contact as inline nav item */}
            <li>
              <span
                onClick={() => openModal("benefit")}
                className="cursor-pointer transition-colors duration-200"
                style={{ color: "var(--color-foreground)" }}
              >
                Check Benefits
              </span>
            </li>
            <li>
              <span
                onClick={() => openModal("contact")}
                className="cursor-pointer transition-colors duration-200"
                style={{ color: "var(--color-foreground)" }}
              >
                Contact
              </span>
            </li>
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
              className="px-4 py-4 space-y-3"
              style={{
                backgroundColor: "var(--color-muted-bg)",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {NAV_ITEMS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm font-medium transition"
                  style={{ color: "var(--color-muted-text)" }}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <span
                onClick={() => openModal("benefit")}
                className="block text-sm font-medium transition cursor-pointer"
                style={{ color: "var(--color-muted-text)" }}
              >
                Check Benefits
              </span>
              {/* Contact in mobile nav */}
              <span
                onClick={() => openModal("contact")}
                className="block text-sm font-medium transition cursor-pointer"
                style={{ color: "var(--color-muted-text)" }}
              >
                Contact
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
