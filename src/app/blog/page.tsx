import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

type PostMeta = {
  title: string;
  date: string;
  slug: string;
  summary?: string;
  tags: string[];
};

export default async function BlogIndexPage() {
  const dir = "content/posts";
  const files = await fs.readdir(dir);

  const posts: PostMeta[] = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(dir, filename);
      const fileContent = await fs.readFile(filePath, "utf8");
      const { data } = matter(fileContent);

      return {
        title: data.title,
        date: data.date,
        slug: data.slug,
        summary: data.summary || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    })
  );

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-bold mb-10 text-gray-900 dark:text-white tracking-tight">
        Blog
      </h1>
      <div className="grid gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-gray-200 hover:shadow-md transition-shadow p-6 bg-white dark:bg-zinc-900"
          >
            <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-1">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {new Date(post.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {post.summary}
            </p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-blue-100 dark:bg-blue-800 dark:text-white text-blue-800 px-2 py-1 rounded-full uppercase tracking-wide"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
