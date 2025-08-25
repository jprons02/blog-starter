// app/components/ui/BlogCard.tsx
"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Tag from "@/app/components/ui/Tag";
import type { Post } from "contentlayer/generated";
import { formatDate } from "@/lib/utils/formatDate";

type Props = {
  post: Post;
  selectedTag?: string | null;
  onTagClick?: (tag: string) => void;
  /** Optional override for the destination URL (e.g., /locations/:state/:city/posts/:slug) */
  href?: string;
};

export default function BlogCard({
  post,
  onTagClick,
  selectedTag,
  href,
}: Props) {
  const date = useMemo(() => formatDate(post.date), [post.date]);

  // Build a slug fallback if Contentlayer’s post.url isn’t what we want
  const slug = useMemo(
    () => post._raw?.flattenedPath?.replace(/^posts\//, "") ?? "",
    [post._raw?.flattenedPath]
  );

  // ✅ prefer the explicit override, else contentlayer url, else /posts/:slug
  const target = href ?? post.url ?? (slug ? `/posts/${slug}` : "/posts");

  return (
    <Link
      href={target}
      className="group block rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
      style={{
        backgroundColor: "var(--color-card-bg)",
        borderColor: "var(--color-card-border)",
        color: "var(--color-card-text)",
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-48 object-cover group-hover:brightness-110 transition"
        />
      )}

      <div className="pt-3 pb-6 px-6">
        <p
          className="font-medium uppercase tracking-wide mb-4"
          style={{ color: "var(--color-muted-text)", fontSize: "0.65rem" }}
        >
          {date} • {post.author?.toUpperCase() || "STAFF"}
        </p>

        <h2
          className="text-xl font-semibold group-hover:underline mb-1"
          style={{ color: "var(--color-foreground)" }}
        >
          {post.title}
        </h2>

        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--color-muted-text)" }}
        >
          {post.summary}
        </p>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Tag
                key={tag}
                name={tag}
                selected={selectedTag?.toLowerCase() === tag.toLowerCase()}
                onClick={onTagClick}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
