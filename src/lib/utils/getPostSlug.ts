/**
 * Extracts the post slug from contentlayer's flattenedPath.
 * Removes the "posts/" prefix and any "MM-YYYY/" date folder.
 *
 * @example
 * "posts/07-2025/my-article" -> "my-article"
 * "posts/my-article" -> "my-article"
 */
export function getPostSlug(flattenedPath: string): string {
  // Remove "posts/" prefix
  const withoutPrefix = flattenedPath.replace(/^posts\//, "");
  // Remove "MM-YYYY/" date folder if present
  return withoutPrefix.replace(/^\d{2}-\d{4}\//, "");
}
