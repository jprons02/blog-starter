import TagsPageClient from "./TagsPageClient";
import { allPosts } from "contentlayer/generated";

// ✅ SEO metadata
export const metadata = {
  title: "Browse by Tag - My Gov Blog",
  description:
    "Explore blog posts by topic to find help with housing, utilities, food, financial aid, and more. Filter resources to match your needs.",
};

export default function TagsPage() {
  return <TagsPageClient allPosts={allPosts} />;
}
