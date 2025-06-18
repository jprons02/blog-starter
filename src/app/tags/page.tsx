import TagsPageClient from "./TagsPageClient";
import { allPosts } from "contentlayer/generated";

export default function TagsPage() {
  return <TagsPageClient allPosts={allPosts} />;
}
