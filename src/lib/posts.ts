// Utility functions to help with common post operations like sorting, filtering, and extracting featured content.
// These functions promote reuse and keep components clean.

import type { Post } from "contentlayer/generated";

/**
 * Sorts blog posts in descending order by date (most recent first).
 *
 * @param posts - Array of blog post objects
 * @returns Sorted array of posts
 */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Filters blog posts to only include those that match the given tag.
 *
 * @param posts - Array of blog post objects
 * @param tag - Tag name to filter by (case-sensitive)
 * @returns Filtered array of posts with the specified tag
 */
export function filterPostsByTag(posts: Post[], tag: string) {
  return posts.filter((post) =>
    post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Separates the featured post (if any) from the rest.
 *
 * @param posts - Array of blog post objects
 * @returns An object with the featured post and an array of the rest
 */
export function splitFeatured(posts: Post[]): {
  featured: Post | null;
  rest: Post[];
} {
  const featured = posts.find((p) => p.featured) || null;
  const rest = posts.filter((p) => !p.featured);
  return { featured, rest };
}
