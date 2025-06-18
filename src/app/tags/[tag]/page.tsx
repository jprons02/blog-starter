import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import TagPageClient from "@/app/tags/[tag]/TagPageClient";
import { sortPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/constants";
import { getOgImageForTag } from "@/lib/og";

export async function generateStaticParams() {
  const tags = [
    ...new Set(
      allPosts.flatMap((post) => post.tags?.map((t) => t.toLowerCase()) || [])
    ),
  ];

  // Turn "affordable connectivity" into "affordable-connectivity"
  return tags.map((tag) => ({
    tag: tag.replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const displayTag = tag.replace(/-/g, " ");
  return {
    title: `Posts tagged with "${displayTag}"`,
    description: `Explore all blog posts categorized under the "${displayTag}" tag.`,
    openGraph: {
      title: `Posts tagged with "${displayTag}"`,
      description: `Explore all blog posts categorized under the "${displayTag}" tag.`,
      url: `${siteUrl}/tags/${displayTag}`,
      type: "website",
      images: [getOgImageForTag(displayTag)],
    },
    twitter: {
      card: "summary_large_image",
      title: `Posts tagged with "${displayTag}"`,
      description: `Explore all blog posts categorized under the "${displayTag}" tag.`,
      images: [getOgImageForTag(displayTag)],
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  // Convert kebab-case back to the original tag format
  const normalizedTag = decodeURIComponent(tag)
    .toLowerCase()
    .replace(/-/g, " ");

  const taggedPosts = allPosts.filter(
    (post) => post.tags?.some((t) => t.toLowerCase() === normalizedTag) // ✅ this is where it goes
  );

  if (!taggedPosts.length) return notFound();

  const sortedPosts = sortPosts(taggedPosts);

  return <TagPageClient posts={sortedPosts} tag={normalizedTag} />;
}
