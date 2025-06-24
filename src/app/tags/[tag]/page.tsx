import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import TagPageClient from "@/app/tags/[tag]/TagPageClient";
import { sortPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/utils/constants";
import { getOgImageForTag } from "@/lib/utils/og";

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

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await props.params;

  const displayTag = tag.replace(/-/g, " ");

  return {
    title: `Posts tagged with "${displayTag}"`,
    description: `Explore all blog posts categorized under the "${displayTag}" tag.`,
    openGraph: {
      title: `Posts tagged with "${displayTag}"`,
      description: `Explore all blog posts categorized under the "${displayTag}" tag.`,
      url: `${siteUrl}/tags/${tag}`, // ✅ Use kebab-case tag for URL
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

export default async function TagPage(props: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await props.params; // URL param (already kebab-case)

  // Helper to normalize tags to kebab-case
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

  // Match posts where a normalized tag equals the kebab-case route param
  const taggedPosts = allPosts.filter((post) =>
    post.tags?.some((t) => normalize(t) === tag)
  );

  if (!taggedPosts.length) return notFound();

  // Pass human-readable tag (e.g., "Affordable Connectivity") to the UI
  const readableTag = tag.replace(/-/g, " ");

  const sortedPosts = sortPosts(taggedPosts);
  return <TagPageClient posts={sortedPosts} tag={readableTag} />;
}
