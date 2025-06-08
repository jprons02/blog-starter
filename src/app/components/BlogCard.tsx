"use client";

import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

type Props = {
  post: PostMeta;
  onTagClick?: (tag: string) => void;
  selectedTag?: string | null;
};

export default function BlogCard({ post, onTagClick, selectedTag }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
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
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        {/* Date + Author */}
        <p
          className="text-xs font-medium uppercase tracking-wide mb-2"
          style={{ color: "var(--color-muted-text)" }}
        >
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          • {post.author?.toUpperCase() || "STAFF"}
        </p>

        {/* Title */}
        <h2
          className="text-xl font-semibold group-hover:underline mb-1"
          style={{ color: "var(--color-foreground)" }}
        >
          {post.title}
        </h2>

        {/* Summary */}
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--color-muted-text)" }}
        >
          {post.summary}
        </p>

        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.preventDefault();
                    onTagClick?.(tag);
                  }}
                  className="text-xs font-medium px-2 py-1 rounded-full uppercase tracking-wide
  transition-all duration-300 ease-in-out cursor-pointer
  hover:shadow-sm hover:brightness-110"
                  style={{
                    fontWeight: "600",
                    fontSize: "0.65rem",
                    backgroundColor: isSelected
                      ? "var(--color-tag-accent-bg)"
                      : "var(--color-tag-bg)",
                    color: isSelected
                      ? "var(--color-tag-accent-text)"
                      : "var(--color-tag-text)",
                  }}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
