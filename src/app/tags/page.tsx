// src/app/tags/page.tsx
import type { Metadata } from "next";
import TagsPageClient from "./TagsPageClient";
import { allPosts } from "contentlayer/generated";

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
      <TagsPageClient allPosts={allPosts} />
    </>
  );
}
