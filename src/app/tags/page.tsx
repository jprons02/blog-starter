// src/app/tags/page.tsx
import type { Metadata } from "next";
import TagsPageClient from "./TagsPageClient";
import { allPosts } from "contentlayer/generated";
import JsonLd from "@/app/components/JsonLd";
import { siteUrl } from "@/lib/utils/constants";

const ogImage = `${siteUrl}/og/default.jpg`;

export const metadata: Metadata = {
  title: "Browse topics",
  description:
    "Explore articles by topic to find help with housing, utilities, food, financial aid, and more.",
  alternates: { canonical: "/tags" }, // ✅ self-canonical
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/tags",
    title: "Browse topics",
    description:
      "Explore articles by topic to find help with housing, utilities, food, financial aid, and more.",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Browse topics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse topics",
    description:
      "Explore articles by topic to find help with housing, utilities, food, financial aid, and more.",
    images: [ogImage],
  },
};

export default function TagsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Browse topics",
          url: `${siteUrl}/tags`,
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: ogImage,
            width: 1200,
            height: 630,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
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
          ],
        }}
      />
      <TagsPageClient allPosts={allPosts} />
    </>
  );
}
