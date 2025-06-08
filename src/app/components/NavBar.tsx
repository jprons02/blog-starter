"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      style={{
        backgroundColor: "var(--color-muted-bg)",
        borderBottom: "1px solid var(--color-border)",
        color: "var(--color-foreground)",
      }}
      className="w-full sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="text-xl font-bold hover:opacity-90 transition"
          style={{ color: "var(--color-primary)" }}
        >
          My Blog
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {["blog", "about", "contact"].map((page) => (
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

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded transition"
          style={{
            color: "var(--color-foreground)",
            backgroundColor: "transparent",
          }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-3"
          style={{
            backgroundColor: "var(--color-muted-bg)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {["blog", "about", "contact"].map((page) => (
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
      )}
    </nav>
  );
}
