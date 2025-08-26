"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tag from "@/app/components/ui/Tag";
import { formatDate } from "@/lib/utils/formatDate";
import type { Post } from "contentlayer/generated";

type Props = {
  post: Post;
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
  /** Optional override for the card href; falls back to post.url */
  href?: string;
};

export default function BlogCard({
  post,
  onTagClick,
  selectedTag,
  href,
}: Props) {
  // format date on the client to match browser locale/runtime if needed
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(formatDate(post.date));
  }, [post.date]);

  const target =
    href ??
    post.url ??
    `/posts/${post._raw.flattenedPath.replace(/^posts\//, "")}`;

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    if (!onTagClick) return;
    e.preventDefault();
    onTagClick(tag);
  };

  return (
    <Link
      href={target}
      className="group block rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
      style={{ backgroundColor: "var(--color-card-bg)" }}
    >
      {post.image && (
        <div className="relative w-full h-48 sm:h-56">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:brightness-110 transition"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            priority={false}
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 group-hover:underline">
          {post.title}
        </h3>

        {post.summary && (
          <p
            className="text-sm leading-snug mb-3"
            style={{ color: "var(--color-muted-text)" }}
          >
            {post.summary}
          </p>
        )}

        <p
          className="uppercase tracking-wide text-xs mb-3"
          style={{ color: "var(--color-muted-text)" }}
        >
          {/* SSR fallback + client effect; hydration-safe */}
          <time dateTime={post.date} suppressHydrationWarning>
            {date || formatDate(post.date)}
          </time>
          &nbsp;&nbsp;•&nbsp;&nbsp;
          {(post.author ?? "STAFF").toUpperCase()}
        </p>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => handleTagClick(tag, e)}
                className="focus:outline-none"
                aria-label={`Filter by ${tag}`}
              >
                <Tag
                  key={tag}
                  name={tag}
                  selected={selectedTag?.toLowerCase() === tag.toLowerCase()}
                  onClick={onTagClick}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
