"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/app/components/ToggleButtonLightDark";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
  }, [isLight]);

  return (
    <nav
      style={{
        color: "var(--color-foreground)",
      }}
      className="w-full top-0 z-40 "
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="text-xl font-bold hover:opacity-90 transition"
          style={{ color: "var(--color-primary)", lineHeight: "0" }}
        >
          <div className="inline-block">
            <Image
              src={
                isLight
                  ? "/logo/blog_logo_dark.svg"
                  : "/logo/blog_logo_light.svg"
              }
              alt="Blog Logo Dark"
              width={36}
              height={36}
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav + ThemeToggle */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {["about", "contact"].map((page) => (
              <li key={page}>
                <Link
                  href={`/${page}`}
                  className="transition-colors duration-200"
                  style={{
                    color: "var(--color-foreground)",
                  }}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle isLight={isLight} setIsLight={setIsLight} />
        </div>

        {/* Mobile: ThemeToggle + Hamburger */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <ThemeToggle isLight={isLight} setIsLight={setIsLight} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded transition"
            style={{
              color: "var(--color-foreground)",
              backgroundColor: "transparent",
            }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
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
              {["about", "contact"].map((page) => (
                <Link
                  key={page}
                  href={`/${page}`}
                  className="block text-sm font-medium transition"
                  style={{
                    color: "var(--color-muted-text)",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/*
    <nav
      style={{
        backgroundColor: "var(--color-muted-bg)",
        borderBottom: "1px solid var(--color-border)",
        color: "var(--color-foreground)",
      }}
      className="w-full sticky top-0 z-40 shadow-sm"
    >
*/
