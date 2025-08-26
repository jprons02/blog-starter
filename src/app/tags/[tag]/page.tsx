// app/tags/[tag]/page.tsx
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TagPageClient from "@/app/tags/[tag]/TagPageClient";
import { sortPosts } from "@/lib/posts";
import { siteImage, siteTitle } from "@/lib/utils/constants";
import { getOgImageForTag } from "@/lib/utils/og";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const unslug = (s: string) => decodeURIComponent(s).replace(/-/g, " ");

export async function generateStaticParams() {
  const tags = new Set<string>();
  for (const p of allPosts) {
    for (const t of p.tags ?? []) tags.add(slugify(t));
  }
  return Array.from(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params; // kebab-case in URL
  const human = unslug(tag);
  const path = `/tags/${encodeURIComponent(tag)}`;

  // newest related post -> freshness proxy
  const newest = allPosts
    .filter((p) => (p.tags ?? []).some((t) => slugify(t) === tag))
    .map((p) => new Date(p.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const ogImage = getOgImageForTag?.(human) ?? siteImage;

  return {
    title: `Posts tagged “${human}” — ${siteTitle}`,
    description: `Explore articles about ${human}. Guides, how-tos, and resources.`,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `Posts tagged “${human}” — ${siteTitle}`,
      description: `Articles on ${human}.`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Posts tagged “${human}” — ${siteTitle}`,
      description: `Articles on ${human}.`,
      images: [ogImage],
    },
    other: newest ? { lastmod: newest.toISOString() } : undefined,
  };
}

export default async function TagPage(props: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await props.params; // kebab-case
  const human = unslug(tag);

  const taggedPosts = allPosts.filter((post) =>
    (post.tags ?? []).some((t) => slugify(t) === tag)
  );
  if (!taggedPosts.length) return notFound();

  const sortedPosts = sortPosts(taggedPosts);

  return (
    <>
      <TagPageClient posts={sortedPosts} tag={human} />
    </>
  );
}

// Rebuild this page’s data at most once per day
export const revalidate = 86400;
