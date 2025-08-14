import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import TagPageClient from "@/app/tags/[tag]/TagPageClient";
import { sortPosts } from "@/lib/posts";
import { siteUrl, siteImage } from "@/lib/utils/constants";
import { getOgImageForTag } from "@/lib/utils/og";
import JsonLd from "@/app/components/JsonLd";

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
  const ogImage = getOgImageForTag(displayTag) || siteImage;

  return {
    title: `Posts tagged with "${displayTag}"`,
    description: `Explore all blog posts categorized under the "${displayTag}" tag.`,
    openGraph: {
      title: `Posts tagged with "${displayTag}"`,
      description: `Explore all blog posts categorized under the "${displayTag}" tag.`,
      url: `${siteUrl}/tags/${tag}`,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `Posts tagged with "${displayTag}"`,
      description: `Explore all blog posts categorized under the "${displayTag}" tag.`,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/tags/${tag}`,
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
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${decodeURIComponent(tag)} articles`,
          url: `${siteUrl}/tags/${tag}`,
        }}
      />
      <TagPageClient posts={sortedPosts} tag={readableTag} />
    </>
  );
}
