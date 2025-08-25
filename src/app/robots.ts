// src/app/robots.ts
import { siteUrl } from "@/lib/utils/constants";

export default function robots() {
  const host = siteUrl;
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Explicit AI crawlers allowed
      { userAgent: "GPTBot", allow: "/" }, // OpenAI
      { userAgent: "ClaudeBot", allow: "/" }, // Anthropic
      { userAgent: "PerplexityBot", allow: "/" }, // Perplexity
      { userAgent: "Google-Extended", allow: "/" }, // Google AI data access
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
