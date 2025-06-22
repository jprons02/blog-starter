"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import BlogCard from "@/app/components/BlogCard";
import Tag from "@/app/components/Tag";
import FadeIn from "@/app/components/FadeIn";
import TagFilterDisplay from "@/app/components/TagFilterDisplay";
import { sortPosts, filterPostsByTag } from "@/lib/posts";
import { siteUrl } from "@/lib/constants";
import type { Post } from "contentlayer/generated";
import { useRouter } from "next/navigation";

export default function TagsPageClient({ allPosts }: { allPosts: Post[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!selectedTag) return;
    try {
      const url = `${siteUrl}${pathname}/${selectedTag
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy tag URL:", err);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    const slug = tag.toLowerCase().replace(/\s+/g, "-");
    router.push(`/tags/${slug}`); // ⬅️ Change the URL on click
  };

  const tagMap = new Map<string, string>();
  for (const post of allPosts) {
    for (const rawTag of post.tags || []) {
      const key = rawTag.toLowerCase();
      if (!tagMap.has(key)) tagMap.set(key, rawTag);
    }
  }

  const tags = Array.from(tagMap.values()).sort();
  const sortedPosts = sortPosts(allPosts);
  const filteredPosts = selectedTag
    ? filterPostsByTag(sortedPosts, selectedTag.toLowerCase())
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Browse by Tag
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <Tag
            key={tag}
            name={tag}
            selected={tag.toLowerCase() === selectedTag?.toLowerCase()}
            onClick={() => handleTagClick(tag)}
          />
        ))}
      </div>

      {selectedTag && (
        <>
          <TagFilterDisplay
            tag={selectedTag}
            onClear={() => setSelectedTag(null)}
          />
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="cursor-pointer transition px-4 py-2 rounded-full text-sm font-medium border border-[var(--color-border)] bg-[var(--color-muted-bg)] hover:brightness-110"
              style={{ color: "var(--color-foreground)" }}
            >
              {copied ? "Copied!" : "Copy Tag URL"}
            </button>
            <span className="text-xs text-[var(--color-muted-text)]">
              Share or bookmark this tag page
            </span>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <FadeIn key={post._id}>
            <BlogCard
              post={post}
              selectedTag={selectedTag}
              onTagClick={setSelectedTag}
            />
          </FadeIn>
        ))}
      </div>

      {selectedTag && filteredPosts.length === 0 && (
        <p
          className="text-sm mt-8"
          style={{ color: "var(--color-muted-text)" }}
        >
          No posts found for #{selectedTag}
        </p>
      )}
    </main>
  );
}
