// src/app/robots.ts
import { siteUrl } from "@/lib/utils/constants";

export default function robots() {
  const host = siteUrl;
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
      // Explicit AI crawlers allowed
      { userAgent: "GPTBot", allow: "/", disallow: "/admin" }, // OpenAI
      { userAgent: "ClaudeBot", allow: "/", disallow: "/admin" }, // Anthropic
      { userAgent: "PerplexityBot", allow: "/", disallow: "/admin" }, // Perplexity
      { userAgent: "Google-Extended", allow: "/", disallow: "/admin" }, // Google AI data access
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
