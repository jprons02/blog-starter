import fs from "fs/promises"; // Node.js promise-based file system API
import path from "path"; // Cross-platform path utility
import matter from "gray-matter"; // Parses frontmatter from Markdown/MDX files

/**
 * Type definition for blog post metadata extracted from frontmatter.
 * These fields are critical for SEO and accessibility:
 * - `title` and `summary` help describe the page for users and crawlers
 * - `slug` is used in URLs
 * - `tags` support filtering and discoverability
 */
export type PostMeta = {
  title: string;
  slug: string;
  summary: string;
  date: string;
  tags: string[];
  // Optionally: add `image`, `image_alt`, `author`, `readingTime`, etc.
};

// Define the folder where all MDX blog posts are stored
const POSTS_DIR = path.join(process.cwd(), "content/posts");

/**
 * Reads all MDX blog files and extracts consistent, SEO-friendly metadata.
 * Returns a list of posts sorted by date (newest first).
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await fs.readdir(POSTS_DIR);

  const posts: PostMeta[] = await Promise.all(
    files
      // Only process `.mdx` blog files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (filename) => {
        const filePath = path.join(POSTS_DIR, filename);
        const fileContent = await fs.readFile(filePath, "utf8");

        // Parse frontmatter from the file
        const { data } = matter(fileContent);

        // Validate and normalize fields for SEO + accessibility
        return {
          title: data.title?.trim() || "Untitled Post",
          slug: data.slug?.trim() || filename.replace(/\.mdx$/, ""),
          summary: data.summary?.trim() || "No summary provided.",
          date: data.date,
          tags: Array.isArray(data.tags)
            ? data.tags.map((tag: string) => tag.toLowerCase())
            : [],
        };
      })
  );

  // Sort posts from newest to oldest based on `date`
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
