"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/app/components/ui/BlogCard";
import Tag from "@/app/components/ui/Tag";
import FadeIn from "@/app/components/ui/FadeIn";
import { sortPosts } from "@/lib/posts";
import type { Post } from "contentlayer/generated";
import { useTagNavigation } from "@/app/hooks/useTagNavigation";

const CATEGORIES = [
  "Housing & Utilities",
  "Phones & Internet",
  "Health & Nutrition",
  "Money & Benefits",
];

export default function TagsPageClient({ allPosts }: { allPosts: Post[] }) {
  const goToTagPage = useTagNavigation();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [postsByCategory, setPostsByCategory] = useState<Post[]>([]);

  useEffect(() => {
    setPostsByCategory(
      allPosts.filter((post) =>
        post.category?.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      ) || []
    );
  }, [selectedCategory, allPosts]);

  const handleTagClick = goToTagPage;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const tagMap = new Map<string, string>();
  for (const post of postsByCategory) {
    for (const rawTag of post.tags || []) {
      const key = rawTag.toLowerCase();
      if (!tagMap.has(key)) tagMap.set(key, rawTag);
    }
  }

  const tags = Array.from(tagMap.values()).sort();
  const sortedPosts = sortPosts(postsByCategory);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Browse by Tags
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-full transition hover:shadow-sm hover:brightness-110"
            style={{
              backgroundColor:
                selectedCategory === category
                  ? "var(--color-primary)"
                  : "var(--color-tag-bg)",
              color:
                selectedCategory === category
                  ? "var(--color-background)"
                  : "var(--color-tag-text)",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <Tag key={tag} name={tag} onClick={() => handleTagClick(tag)} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
          <FadeIn key={post._id}>
            <BlogCard post={post} onTagClick={goToTagPage} />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
