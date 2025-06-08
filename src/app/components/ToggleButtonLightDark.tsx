"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  const darkStyles = {
    backgroundColor: "var(--color-static-light-background)",
    borderColor: "var(--color-static-light-border)",
    color: "var(--color-static-light-foreground)",
    borderWidth: "1px",
    borderStyle: "solid",
  };
  const lightStyles = {
    backgroundColor: "var(--color-static-dark-background)",
    borderColor: "var(--color-static-dark-border)",
    color: "var(--color-static-dark-foreground)",
    borderWidth: "1px",
    borderStyle: "solid",
  };

  return (
    <button
      onClick={() => {
        setIsLight((prev) => {
          document.documentElement.classList.toggle("light", !prev);
          return !prev;
        });
      }}
      className="text-sm rounded border transition cursor-pointer"
      style={isLight ? lightStyles : darkStyles}
    >
      {isLight ? "🌙" : "☀"}
    </button>
  );
}
