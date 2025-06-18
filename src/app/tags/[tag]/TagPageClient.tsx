"use client";

import BlogCard from "@/app/components/BlogCard";
import FadeIn from "@/app/components/FadeIn";
import TagFilterDisplay from "@/app/components/TagFilterDisplay";
import type { Post } from "contentlayer/generated";
import { useRouter } from "next/navigation";

type Props = {
  posts: Post[];
  tag: string;
};

export default function TagPageClient({ posts, tag }: Props) {
  const router = useRouter();

  const handleClearFilter = () => {
    if (
      document.referrer &&
      !document.referrer.includes(window.location.href)
    ) {
      router.back();
    } else {
      router.push("/tags");
    }
  };
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Posts tagged with: <span className="capitalize">{tag}</span>
      </h1>

      <TagFilterDisplay tag={tag} onClear={handleClearFilter} />

      {/* 🧱 Blog cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((post) => (
          <FadeIn key={post._id}>
            <BlogCard post={post} selectedTag={tag} />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
