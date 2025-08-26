import { allPosts } from "contentlayer/generated";
import BlogIndexClient from "@/app/posts/BlogIndexClient";
import { getPageMeta } from "@/lib/utils/seo";
import { siteTitle, siteDescription, siteImage } from "@/lib/utils/constants";

export const metadata = getPageMeta({
  title: siteTitle,
  description: siteDescription,
  slug: "", // homepage has no slug
  image: siteImage, // fallback OG image
  type: "website",
});

export default function BlogIndexPage() {
  return (
    <>
      <BlogIndexClient posts={allPosts} />
    </>
  );
}
