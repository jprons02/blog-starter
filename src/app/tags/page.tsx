// src/app/tags/page.tsx
import type { Metadata } from "next";
import TagsPageClient from "./TagsPageClient";
import { allPosts } from "contentlayer/generated";
import JsonLd from "@/app/components/JsonLd";
import { siteUrl } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Browse topics",
  description:
    "Explore articles by topic to find help with housing, utilities, food, financial aid, and more.",
  // metadataBase should already be set globally to siteUrl
  alternates: { canonical: "/tags" }, // ✅ self-canonical
  robots: { index: true, follow: true }, // ✅ indexable
  openGraph: {
    type: "website",
    url: "/tags",
    title: "Browse topics",
    description:
      "Explore articles by topic to find help with housing, utilities, food, financial aid, and more.",
  },
  twitter: { card: "summary_large_image" },
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
