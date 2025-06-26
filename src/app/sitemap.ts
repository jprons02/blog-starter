import { allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    // 👇 DO NOT include /privacy-policy or /resources
    ...allPosts.map((post) => ({
      url: `${siteUrl}/${post._raw.flattenedPath}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
