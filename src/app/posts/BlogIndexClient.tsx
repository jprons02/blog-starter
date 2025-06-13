"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/app/components/SearchBar";
import BlogCard from "@/app/components/BlogCard";
//import FadeIn from "@/app/components/FadeIn";
import type { Post } from "contentlayer/generated";

type Props = {
  posts: Post[];
};

export default function BlogIndexClient({ posts }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fuse = new Fuse(posts, {
    keys: ["title", "summary", "tags"],
    threshold: 0.3,
  });

  let filtered = searchQuery
    ? fuse.search(searchQuery).map((r) => r.item)
    : posts;

  if (selectedTag) {
    filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
  }

  const featured = filtered.find((p) => p.featured);
  const postsWithoutFeatured = filtered.filter((p) => !p.featured);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* 🎯 Active tag filter display */}
      {selectedTag && (
        <div className="mb-6">
          <span
            className="text-sm"
            style={{ color: "var(--color-muted-text)" }}
          >
            Filtering by tag:
            <span
              className="ml-1 font-semibold"
              style={{ color: "var(--color-foreground)" }}
            >
              #{selectedTag}
            </span>
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className="ml-4 text-sm cursor-pointer hover:brightness-70"
            style={{
              color: "var(--color-primary)",
              textDecoration: "underline",
            }}
          >
            Clear filter
          </button>
        </div>
      )}

      {/* 🌟 Featured Post Hero */}
      {featured && (
        <Link
          href={featured.url}
          className="group block rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all"
        >
          <div className="relative h-72 sm:h-96 w-full group-hover:brightness-110 transition">
            <Image
              src={featured.image!}
              alt={featured.title}
              fill
              className="object-cover group-hover:brightness-110 transition"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
              <h2
                className="text-3xl sm:text-5xl font-bold mb-3 group-hover:underline"
                style={{ color: "var(--color-static-dark-foreground)" }}
              >
                {featured.title}
              </h2>
              <p
                className="text-sm sm:text-base max-w-2xl line-clamp-3"
                style={{ color: "var(--color-static-dark-muted-text)" }}
              >
                {featured.summary}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* 🔍 Search Bar */}
      <div className="mt-12 mb-1">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* 🧱 Blog Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {postsWithoutFeatured.map((post) => (
          <BlogCard
            key={post.url}
            post={post}
            selectedTag={selectedTag}
            onTagClick={setSelectedTag}
          />
        ))}
      </div>
    </main>
  );
}
