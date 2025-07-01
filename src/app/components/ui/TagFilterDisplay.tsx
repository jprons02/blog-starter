"use client";

import { useRouter } from "next/navigation";

export default function TagFilterDisplay({ tag }: { tag: string }) {
  const router = useRouter();

  return (
    <div>
      <div className="flex gap-3">
        <a
          onClick={() => router.push("/")}
          className="mr-3 cursor-pointer underline text-[var(--color-link)] hover:text-[var(--color-link-hover)]"
        >
          Blogs
        </a>

        <a
          onClick={() => router.push("/tags")}
          className="cursor-pointer underline text-[var(--color-link)] hover:text-[var(--color-link-hover)]"
        >
          Browse by Tags
        </a>
      </div>
      <div
        className="text-sm text-[var(--color-muted-text)]"
        style={{ marginTop: "0.5rem" }}
      >
        <p>
          Showing posts tagged with:
          <span className="ml-1 font-semibold text-[var(--color-foreground)]">
            #{tag}
          </span>
        </p>
      </div>
    </div>
  );
}
