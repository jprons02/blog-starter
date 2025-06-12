import { allPosts } from "contentlayer/generated";
import BlogIndexClient from "@/app/posts/BlogIndexClient";

export default function BlogIndexPage() {
  return <BlogIndexClient posts={allPosts} />;
}
