/*
"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/app/components/SearchBar";
import BlogCard from "@/app/components/BlogCard";
import FadeIn from "@/app/components/FadeIn";
import TagFilterDisplay from "@/app/components/TagFilterDisplay";
import { sortPosts, filterPostsByTag, splitFeatured } from "@/lib/posts";
import type { Post } from "contentlayer/generated";
import { formatDate } from "@/lib/formatDate";

type Props = {
  posts: Post[];
  initialTag?: string;
};

export default function BlogIndexClient({ posts, initialTag }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(
    initialTag || null
  );

  // Sort posts by date (newest first)
  const sortedPosts = sortPosts(posts);

  // Set up Fuse.js for fuzzy search across title, summary, and tags
  const fuse = new Fuse(sortedPosts, {
    keys: ["title", "summary", "tags"],
    threshold: 0.3,
  });

  // Filter posts based on search query and selected tag
  let filtered = searchQuery
    ? fuse.search(searchQuery).map((r) => r.item)
    : sortedPosts;

  if (selectedTag) {
    filtered = filterPostsByTag(filtered, selectedTag);
  }

  // Split featured post from the rest
  const { featured, rest: postsWithoutFeatured } = splitFeatured(filtered);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {selectedTag && (
        <TagFilterDisplay
          tag={selectedTag}
          onClear={() => setSelectedTag(null)}
        />
      )}

      {featured && (
        <FadeIn>
          <Link
            href={featured.url}
            className="group block rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            <div className="relative h-[22rem] sm:h-96 w-full group-hover:brightness-110 transition">
              {featured.image && (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:brightness-110 transition"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                <h2
                  className="text-3xl sm:text-5xl font-bold mb-3 group-hover:underline"
                  style={{ color: "var(--color-static-dark-foreground)" }}
                >
                  {featured.title}
                </h2>
                <p
                  className="text-sm sm:text-base max-w-2xl line-clamp-4 sm:line-clamp-3 featured-summary"
                  style={{ color: "#bac2cd" }}
                >
                  {featured.summary}
                </p>
                <p
                  className="uppercase tracking-wide mt-4 featured-meta"
                  style={{
                    color: "#bac2cd",
                    fontSize: "0.65rem",
                  }}
                >
                  {formatDate(featured.date)}
                  &nbsp;&nbsp;•&nbsp;&nbsp;
                  {featured.author?.toUpperCase() || "STAFF"}
                </p>
              </div>
            </div>
          </Link>
        </FadeIn>
      )}

      <FadeIn delay={250}>
        <div className="mt-12 mb-1">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {postsWithoutFeatured.map((post) => (
          <FadeIn key={post.url} delay={250}>
            <BlogCard
              post={post}
              selectedTag={selectedTag}
              onTagClick={setSelectedTag}
            />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
*/

"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/app/components/SearchBar";
import BlogCard from "@/app/components/BlogCard";
import FadeIn from "@/app/components/FadeIn";
import TagFilterDisplay from "@/app/components/TagFilterDisplay";
import { sortPosts, filterPostsByTag, splitFeatured } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";
import type { Post } from "contentlayer/generated";

type Props = {
  posts: Post[];
  initialTag?: string;
};

export default function BlogIndexClient({ posts, initialTag }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(
    initialTag || null
  );

  const sortedPosts = sortPosts(posts);

  const fuse = new Fuse(sortedPosts, {
    keys: ["title", "summary", "tags"],
    threshold: 0.3,
  });

  let filtered = searchQuery
    ? fuse.search(searchQuery).map((r) => r.item)
    : sortedPosts;

  if (selectedTag) {
    filtered = filterPostsByTag(filtered, selectedTag);
  }

  const { featured, rest: postsWithoutFeatured } = splitFeatured(filtered);

  // ✅ Precompute date string safely
  const formattedFeaturedDate = featured ? formatDate(featured.date) : "";

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {selectedTag && (
        <TagFilterDisplay
          tag={selectedTag}
          onClear={() => setSelectedTag(null)}
        />
      )}

      {featured && (
        <FadeIn>
          <Link
            href={featured.url}
            className="group block rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            <div className="relative h-[22rem] sm:h-96 w-full group-hover:brightness-110 transition">
              {featured.image && (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:brightness-110 transition"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                <h2
                  className="text-3xl sm:text-5xl font-bold mb-3 group-hover:underline"
                  style={{ color: "var(--color-static-dark-foreground)" }}
                >
                  {featured.title}
                </h2>
                <p
                  className="text-sm sm:text-base max-w-2xl line-clamp-4 sm:line-clamp-3 featured-summary"
                  style={{ color: "#bac2cd" }}
                >
                  {featured.summary}
                </p>
                <p
                  className="uppercase tracking-wide mt-4 featured-meta"
                  style={{ color: "#bac2cd", fontSize: "0.65rem" }}
                >
                  {formattedFeaturedDate}
                  &nbsp;&nbsp;•&nbsp;&nbsp;
                  {featured.author?.toUpperCase() || "STAFF"}
                </p>
              </div>
            </div>
          </Link>
        </FadeIn>
      )}

      <FadeIn delay={250}>
        <div className="mt-12 mb-1">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {postsWithoutFeatured.map((post) => (
          <FadeIn key={post.url} delay={250}>
            <BlogCard
              post={post}
              selectedTag={selectedTag}
              onTagClick={setSelectedTag}
            />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
