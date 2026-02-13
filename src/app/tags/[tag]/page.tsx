// app/tags/[tag]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TagPageClient from "@/app/tags/[tag]/TagPageClient";
import { sortPosts, getPublishedPosts } from "@/lib/posts";
import { siteUrl, siteTitle, siteImage } from "@/lib/utils/constants";
import { getPostSlug } from "@/lib/utils/getPostSlug";
import JsonLd from "@/app/components/JsonLd";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const unslug = (s: string) => decodeURIComponent(s).replace(/-/g, " ");

export async function generateStaticParams() {
  const tags = new Set<string>();
  for (const p of getPublishedPosts()) {
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
  const canonicalAbs = `${siteUrl}${path}`;

  // newest related post -> freshness proxy
  const newest = getPublishedPosts()
    .filter((p) => (p.tags ?? []).some((t) => slugify(t) === tag))
    .map((p) => new Date(p.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const ogImage = `${siteUrl}${siteImage}`;

  return {
    title: `Posts tagged “${human}”`,
    description: `Explore articles about ${human}. Guides, how-tos, and resources.`,
    alternates: { canonical: canonicalAbs },
    openGraph: {
      type: "website",
      url: canonicalAbs,
      siteName: siteTitle,
      title: `Posts tagged “${human}”`,
      description: `Articles on ${human}.`,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Posts tagged “${human}”`,
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

  const taggedPosts = getPublishedPosts().filter((post) =>
    (post.tags ?? []).some((t) => slugify(t) === tag),
  );
  if (!taggedPosts.length) return notFound();

  const sortedPosts = sortPosts(taggedPosts);

  // For ItemList JSON-LD (limit to what you actually render initially)
  const list = sortedPosts.slice(0, 20).map((p, i) => {
    const slug = getPostSlug(p._raw.flattenedPath);
    return {
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/posts/${slug}`,
      name: p.title,
    };
  });

  return (
    <>
      {/* Breadcrumbs */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": `${siteUrl}/tags/${encodeURIComponent(tag)}#breadcrumbs`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${siteUrl}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Tags",
              item: `${siteUrl}/tags`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: human,
              item: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
            },
          ],
        }}
      />

      {/* Collection + ItemList (discovery boost) */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${siteUrl}/tags/${encodeURIComponent(tag)}#collection`,
          name: `${human} articles`,
          url: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: `${siteUrl}${siteImage}`,
            width: 1200,
            height: 630,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          numberOfItems: list.length,
          itemListElement: list,
        }}
      />

      <TagPageClient posts={sortedPosts} tag={human} />
    </>
  );
}

// Rebuild this page’s data at most once per day
export const revalidate = 86400;
