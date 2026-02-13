// src/app/tags/page.tsx
import type { Metadata } from "next";
import TagsPageClient from "./TagsPageClient";
import { getPublishedPosts } from "@/lib/posts";
import JsonLd from "@/app/components/JsonLd";
import { siteUrl, siteImage } from "@/lib/utils/constants";

const ogImage = `${siteUrl}${siteImage}`;

export const metadata: Metadata = {
  title: "Browse Topics — Government Assistance Articles by Category",
  description:
    "Explore articles by topic to find help with housing, utilities, food, financial aid, and more.",
  alternates: { canonical: `${siteUrl}/tags` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteUrl}/tags`,
    siteName: "My Gov Blog",
    locale: "en_US",
    title: "Browse Topics — Government Assistance Articles by Category",
    description:
      "Explore articles by topic to find help with housing, utilities, food, financial aid, and more.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Browse topics on My Gov Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Topics — Government Assistance Articles by Category",
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
      <TagsPageClient allPosts={getPublishedPosts()} />
    </>
  );
}
