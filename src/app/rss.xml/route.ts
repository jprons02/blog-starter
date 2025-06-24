import { allPosts } from "contentlayer/generated";
import { siteUrl } from "@/lib/utils/constants";

export async function GET() {
  const feedItems = allPosts
    .map(
      (post) => `
    <item>
      <title>${post.title}</title>
      <link>${siteUrl}/${post._raw.flattenedPath}</link>
      <description>${post.summary}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${siteUrl}/${post._raw.flattenedPath}</guid>
    </item>
  `
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Your Blog Title</title>
  <link>${siteUrl}</link>
  <description>Latest posts from your blog</description>
  ${feedItems}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
