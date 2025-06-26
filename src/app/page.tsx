/*
import { allPosts } from "contentlayer/generated";
import BlogIndexClient from "@/app/posts/BlogIndexClient";

export default function BlogIndexPage() {
  return <BlogIndexClient posts={allPosts} />;
}
*/

import { allPosts } from "contentlayer/generated";
import BlogIndexClient from "@/app/posts/BlogIndexClient";
import { getPageMeta } from "@/lib/utils/seo";
import { siteTitle, siteDescription } from "@/lib/utils/constants";

export const metadata = getPageMeta({
  title: siteTitle,
  description: siteDescription,
  slug: "", // homepage has no slug
  image: `${process.env.NEXT_PUBLIC_SITE_URL}/default-og.jpg`, // fallback OG image
  type: "website",
});

export default function BlogIndexPage() {
  return <BlogIndexClient posts={allPosts} />;
}
