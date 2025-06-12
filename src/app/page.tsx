import { allPosts } from "contentlayer/generated";
import BlogIndexClient from "@/app/blog/BlogIndexClient";

export default function BlogIndexPage() {
  return <BlogIndexClient posts={allPosts} />;
}
