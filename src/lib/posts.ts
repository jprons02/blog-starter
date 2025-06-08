import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type PostMeta = {
  author?: string;
  title: string;
  slug: string;
  summary: string;
  date: string;
  tags: string[];
  image?: string;
  featured?: boolean;
};

const POSTS_DIR = path.join(process.cwd(), "content/posts");

// 🔒 Optional: Memoization
// let cachedPosts: PostMeta[] | null = null;

export async function getAllPosts(): Promise<PostMeta[]> {
  // if (cachedPosts) return cachedPosts;

  const files = await fs.readdir(POSTS_DIR);
  const seenSlugs = new Set<string>();

  const posts: PostMeta[] = [];

  for (const filename of files.filter((file) => file.endsWith(".mdx"))) {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);

    // 🔍 Extract values with fallback
    const title = data.title?.trim();
    const slug = data.slug?.trim() || filename.replace(/\.mdx$/, "");
    const date = data.date;
    const tags = Array.isArray(data.tags)
      ? data.tags.map((tag: string) => tag.toLowerCase())
      : [];

    // ❌ Validate required fields
    if (!title || !date) {
      throw new Error(
        `Missing required frontmatter in ${filename}. "title" and "date" are required.`
      );
    }

    // ❌ Check for slug collision
    if (seenSlugs.has(slug)) {
      throw new Error(
        `Duplicate slug "${slug}" found in ${filename}. Slugs must be unique.`
      );
    }
    seenSlugs.add(slug);

    // ✅ Add post
    posts.push({
      title,
      slug,
      summary: data.summary?.trim() || content.slice(0, 200).trim() + "...",
      date: new Date(date).toISOString(),
      tags,
      image: data.image || undefined,
      author: data.author?.trim() || "Staff Writer",
      featured: !!data.featured,
    });
  }

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // cachedPosts = sortedPosts;

  return sortedPosts;
}
