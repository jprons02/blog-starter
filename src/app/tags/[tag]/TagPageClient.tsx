"use client";

import BlogCard from "@/app/components/ui/BlogCard";
import FadeIn from "@/app/components/ui/FadeIn";
import TagFilterDisplay from "@/app/components/ui/TagFilterDisplay";
import type { Post } from "contentlayer/generated";
import { useTagNavigation } from "@/app/hooks/useTagNavigation";

type Props = {
  posts: Post[];
  tag: string;
};

export default function TagPageClient({ posts, tag }: Props) {
  const goToTagPage = useTagNavigation();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Posts tagged with: <span className="capitalize">{tag}</span>
      </h1>

      <TagFilterDisplay tag={tag} />

      {/* 🧱 Blog cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((post) => (
          <FadeIn key={post._id}>
            <BlogCard post={post} selectedTag={tag} onTagClick={goToTagPage} />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
