// src/app/robots.ts
export default function robots() {
  const host = "https://mygovblog.com";
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
