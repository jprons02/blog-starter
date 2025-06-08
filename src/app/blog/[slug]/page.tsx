import fs from "fs/promises"; // Asynchronous file system access
import path from "path"; // Cross-platform path manipulation
import matter from "gray-matter"; // Parses frontmatter (YAML) from markdown files
import Image from "next/image"; // Optimized image component for Next.js
import { MDXRemote } from "next-mdx-remote/rsc"; // Renders MDX content server-side (RSC-compatible)

// 📌 Ensures the route is statically generated at build time
export const dynamic = "force-static";

// 📄 Renders a single blog post based on the MDX file matched by its slug
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>; // ⚠️ Bug workaround — should be non-promise in stable Next.js
}) {
  const { slug } = await params;

  // Resolve and read the MDX file
  const filePath = path.join("content/posts", `${slug}.mdx`);
  const fileContent = await fs.readFile(filePath, "utf8");

  // Extract frontmatter and markdown content
  const { content, data } = matter(fileContent);

  return (
    <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto py-12 px-4">
      {/* 📷 Optional featured image */}
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

      {/* 📝 Title and date */}
      <h1 style={{ color: "var(--color-foreground)" }}>{data.title}</h1>
      <p className="text-sm" style={{ color: "var(--color-muted-text)" }}>
        {new Date(data.date).toLocaleDateString()}
      </p>

      {/* 🏷️ Tags, if available */}
      {Array.isArray(data.tags) && (
        <div className="flex flex-wrap gap-2 my-4">
          {data.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-medium px-2 py-1 rounded-full uppercase tracking-wide"
              style={{
                backgroundColor: "var(--color-tag-bg)",
                color: "var(--color-tag-text)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 📚 Render markdown content */}
      <div className="markdown-body text-base leading-relaxed">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}

// 🧠 Generate SEO metadata from the MDX frontmatter
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // ⚠️ Same workaround as above
}) {
  const { slug } = await params;

  const filePath = path.join("content/posts", `${slug}.mdx`);
  const fileContent = await fs.readFile(filePath, "utf8");
  const { data } = matter(fileContent);

  return {
    title: data.title,
    description: data.summary || data.excerpt || "",
    openGraph: {
      title: data.title,
      description: data.summary || data.excerpt || "",
      images: data.image ? [{ url: data.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.summary || data.excerpt || "",
      images: data.image ? [data.image] : [],
    },
  };
}
