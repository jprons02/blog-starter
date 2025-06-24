"use client";

import React from "react";

type TagProps = {
  name: string;
  selected?: boolean;
  onClick?: (tag: string) => void;
};

export default function Tag({ name, selected, onClick }: TagProps) {
  const TagEl = onClick ? "button" : "span";

  const baseClass = `
    text-xs font-medium px-2 py-1 rounded-full uppercase tracking-wide
    transition-all duration-300 ease-in-out hover:shadow-sm hover:brightness-110
  `;

  const cursorClass = onClick ? "cursor-pointer" : "cursor-default";

  const className = `${baseClass} ${cursorClass}`;

  const style = {
    fontWeight: 600,
    fontSize: "0.65rem",
    backgroundColor: selected ? "var(--color-primary)" : "var(--color-tag-bg)",
    color: selected ? "var(--color-background)" : "var(--color-tag-text)",
  };

  return (
    <TagEl
      onClick={(e: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>) => {
        if (onClick) {
          e.preventDefault();
          onClick(name);
        }
      }}
      className={className}
      style={style}
    >
      #{name}
    </TagEl>
  );
}
