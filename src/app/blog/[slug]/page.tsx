import fs from "fs/promises"; // Node.js API for reading local files
import path from "path"; // Utility for resolving file paths
import matter from "gray-matter"; // Parses frontmatter from MDX content
import Image from "next/image"; // Optimized image component from Next.js
import { MDXRemote } from "next-mdx-remote/rsc"; // Renders MDX content server-side

/**
 * Server component that renders an individual blog post.
 * This file corresponds to the route /blog/[slug].
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 🧠 Await the `slug` from route parameters (required for dynamic routing)
  const { slug } = await params;

  // 📁 Construct the path to the MDX file based on the slug
  const filePath = path.join("content/posts", `${slug}.mdx`);

  // 📄 Read the file contents as text
  const fileContent = await fs.readFile(filePath, "utf8");

  // 🔍 Extract frontmatter and content from the MDX file
  const { content, data } = matter(fileContent);

  return (
    <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto py-12 px-4">
      {/* 🖼️ Render cover image if it exists in frontmatter */}
      {data.image && (
        <div className="mb-6">
          <Image
            src={data.image}
            alt={data.title} // ✅ Accessible alt text using the post title (can be improved with `image_alt`)
            width={800}
            height={400}
            className="rounded-xl w-full h-auto object-cover"
            priority // ✅ Optimize for loading performance
          />
        </div>
      )}

      {/* 📝 Blog post title as main heading — important for SEO & accessibility */}
      <h1>{data.title}</h1>

      {/* 🗓️ Post publish date */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(data.date).toLocaleDateString()}
      </p>

      {/* 🏷️ Tags — helpful for filtering and SEO keyword density */}
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

      {/* 📚 Render the actual Markdown/MDX content of the blog post */}
      <MDXRemote source={content} />
    </article>
  );
}
