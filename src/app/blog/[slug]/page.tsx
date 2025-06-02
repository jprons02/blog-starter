import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";

// existing imports...
import clsx from "clsx"; // optional, for reusable class merging

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filePath = path.join("content/posts", `${slug}.mdx`);
  const fileContent = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(fileContent);

  return (
    <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto py-12 px-4">
      {data.image && (
        <div className="mb-6">
          <Image
            src={data.image}
            alt={data.title}
            width={800}
            height={400}
            className="rounded-xl w-full h-auto object-cover"
            priority
          />
        </div>
      )}
      <h1>{data.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(data.date).toLocaleDateString()}
      </p>

      {Array.isArray(data.tags) && (
        <div className="flex flex-wrap gap-2 my-4">
          {data.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-medium bg-blue-100 dark:bg-blue-800 dark:text-white text-blue-800 px-2 py-1 rounded-full uppercase tracking-wide"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <MDXRemote source={content} />
    </article>
  );
}
