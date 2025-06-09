import { getAllPosts } from "@/lib/posts";
import BlogIndexClient from "@/app/blog/BlogIndexClient";

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  return <BlogIndexClient posts={posts} />;
}
