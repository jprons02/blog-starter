"use client";

import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({
  isLight,
  setIsLight,
}: {
  isLight: boolean;
  setIsLight: (val: boolean) => void;
}) {
  const lightStyles = {
    color: "var(--color-static-light-foreground)",
  };
  const darkStyles = {
    color: "var(--color-static-dark-foreground)",
  };

  return (
    <button
      onClick={() => setIsLight(!isLight)}
      className="cursor-pointer"
      style={isLight ? lightStyles : darkStyles}
    >
      {isLight ? (
        <Moon className="w-7 h-7 transition-transform duration-200 hover:rotate-12" />
      ) : (
        <Sun className="w-7 h-7 transition-transform duration-200 hover:rotate-12" />
      )}
    </button>
  );
}
