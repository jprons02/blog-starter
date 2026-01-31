// app/tags/[tag]/TagPageClient.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { getPostSlug } from "@/lib/utils/getPostSlug";
import BlogCard from "@/app/components/ui/BlogCard";
import FadeIn from "@/app/components/ui/FadeIn";
import TagFilterDisplay from "@/app/components/ui/TagFilterDisplay";
import type { Post } from "contentlayer/generated";

type CurrentLoc = {
  state: string;
  city: string;
  stateName?: string;
  cityName?: string;
};

type Props = {
  posts: Post[];
  tag: string;
  /** Present on localized tag pages */
  current?: CurrentLoc;
};

const slugifyTag = (t: string) => t.toLowerCase().replace(/\s+/g, "-");

export default function TagPageClient({ posts, tag, current }: Props) {
  const router = useRouter();

  const onTagClick = (t: string) => {
    const slug = slugifyTag(t);
    if (current) {
      router.push(
        `/locations/${current.state}/${current.city}/tags/${encodeURIComponent(
          slug,
        )}`,
      );
    } else {
      router.push(`/tags/${encodeURIComponent(slug)}`);
    }
  };

  const buildPostHref = useMemo(() => {
    if (!current) {
      return (p: Post) => `/posts/${getPostSlug(p._raw.flattenedPath)}`;
    }
    return (p: Post) =>
      `/locations/${current.state}/${current.city}/posts/${getPostSlug(p._raw.flattenedPath)}`;
  }, [current]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Posts tagged with: <span className="capitalize">{tag}</span>
        {current ? (
          <>
            {" "}
            — {current.cityName ?? current.city},{" "}
            {current.stateName ?? current.state}
          </>
        ) : null}
      </h1>

      {/* 👇 Send users back to the city hub; hide "Blogs" on localized pages */}
      <TagFilterDisplay
        tag={tag}
        hideBlogs={!!current}
        browseHref={
          current ? `/locations/${current.state}/${current.city}` : "/tags"
        }
        browseLabel={
          current
            ? `Browse ${current.cityName ?? "city"} articles`
            : "Browse by Tag"
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((post) => (
          <FadeIn key={post._id}>
            <BlogCard
              post={post}
              selectedTag={tag}
              onTagClick={onTagClick}
              href={buildPostHref(post)}
            />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
