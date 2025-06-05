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
        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 px-4 py-3 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
