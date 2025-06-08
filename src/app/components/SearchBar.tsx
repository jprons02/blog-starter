"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    onSearch(query);
  };

  return (
    <div className="w-full mb-6">
      <label htmlFor="search" className="sr-only">
        Search posts
      </label>
      <input
        type="text"
        id="search"
        placeholder="Search blog posts..."
        value={value}
        onChange={handleChange}
        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary] transition"
        style={{
          backgroundColor: "var(--color-card-bg)",
          border: "1px solid var(--color-card-border)",
          color: "var(--color-card-text)",
        }}
      />
    </div>
  );
}
