"use client";

import Image from "next/image";
import Link from "next/link";
import Tag from "@/app/components/Tag";
import type { Post } from "contentlayer/generated";

type Props = {
  post: Post; // ✅ Single post, not an array
  selectedTag?: string | null;
  onTagClick?: (tag: string) => void;
};

export default function BlogCard({ post, onTagClick, selectedTag }: Props) {
  return (
    <Link
      href={post.url}
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
        {/* Date + Author */}
        <p
          className="font-medium uppercase tracking-wide mb-4"
          style={{ color: "var(--color-muted-text)", fontSize: "0.65rem" }}
        >
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
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
              return (
                <Tag
                  key={tag}
                  name={tag}
                  selected={selectedTag === tag}
                  onClick={onTagClick}
                />
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
