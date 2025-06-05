"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import SearchBar from "@/app/components/SearchBar";

type PostMeta = {
  title: string;
  slug: string;
  summary: string;
  date: string;
  tags: string[];
};

export default function BlogIndexClient({ posts }: { posts: PostMeta[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Initialize fuzzy search on title, summary, and tags
  const fuse = new Fuse(posts, {
    keys: ["title", "summary", "tags"],
    threshold: 0.3,
  });

  // Filter by search query first, then tag
  let filtered = searchQuery
    ? fuse.search(searchQuery).map((r) => r.item)
    : posts;

  if (selectedTag) {
    filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
  }

  const filteredPosts = filtered;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Blog heading */}
      <h1 className="text-4xl font-bold mb-6 dark:text-white text-gray-900">
        Blog
      </h1>

      {/* Search bar */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Active tag filter with reset */}
      {selectedTag && (
        <div className="mb-6">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Filtering by tag:
            <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">
              #{selectedTag}
            </span>
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className="ml-4 text-sm text-blue-600 hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Posts list */}
      <div className="grid gap-8">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <article className="rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Post title */}
              <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 group-hover:underline">
                {post.title}
              </h2>

              {/* Post date */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date(post.date).toLocaleDateString()}
              </p>

              {/* Summary for SEO and preview */}
              <p className="text-gray-700 dark:text-gray-300 mt-3 line-clamp-3">
                {post.summary}
              </p>

              {/* Tags (clickable buttons that filter posts) */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag((prev) => (prev === tag ? null : tag));
                      }}
                      className={`text-xs font-medium px-2 py-1 rounded-full uppercase tracking-wide transition
                        ${
                          selectedTag === tag
                            ? "bg-blue-700 text-white"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white"
                        }`}
                      aria-label={`Filter by ${tag}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
