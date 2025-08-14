import { allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl, // root
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/tools/benefit-checker`, // NEW
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const postUrls: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${siteUrl}/posts/${post._raw.flattenedPath.replace(/^posts\//, "")}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticUrls, ...postUrls];
}
