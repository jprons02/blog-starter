export interface UrlValidationResult {
  url: string;
  valid: boolean;
  status?: number;
  error?: string;
  suggestedReplacement?: {
    url: string;
    title: string;
    snippet: string;
  };
  linkContext?: string;
}

export async function validateUrl(url: string): Promise<UrlValidationResult> {
  try {
    // Check if URL is well-formed
    new URL(url);

    // Make HEAD request to check if URL is accessible
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    clearTimeout(timeoutId);

    // Consider 2xx and 3xx as valid (redirects are ok)
    const valid = response.status >= 200 && response.status < 400;

    return {
      url,
      valid,
      status: response.status,
    };
  } catch (error) {
    // If HEAD fails, try GET (some servers don't support HEAD)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      clearTimeout(timeoutId);

      const valid = response.status >= 200 && response.status < 400;

      return {
        url,
        valid,
        status: response.status,
      };
    } catch (getError) {
      return {
        url,
        valid: false,
        error:
          getError instanceof Error
            ? getError.message
            : "Failed to validate URL",
      };
    }
  }
}

export interface ReferenceLink {
  url: string;
  title: string;
  fullHtml: string;
}

export function extractReferencesFromMdx(content: string): ReferenceLink[] {
  const links: ReferenceLink[] = [];

  // Extract URLs from References section
  const referencesMatch = content.match(
    /#{1,6}\s*References[\s\S]*?(?=\n#{1,6}|$)/i,
  );

  if (referencesMatch) {
    const referencesSection = referencesMatch[0];

    // Match full anchor tags
    const linkMatches = referencesSection.matchAll(
      /<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi,
    );

    for (const match of linkMatches) {
      const url = match[1];
      const title = match[2];
      if (url && url.startsWith("http")) {
        links.push({
          url,
          title,
          fullHtml: match[0],
        });
      }
    }
  }

  return links;
}

export async function findReplacementLink(
  brokenUrl: string,
  linkTitle: string,
  articleContent: string,
): Promise<{ url: string; title: string; snippet: string } | null> {
  try {
    // Use Google Custom Search API
    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      console.warn(
        "Google API credentials not configured, skipping replacement search",
      );
      return null;
    }

    // Extract topic from article title
    const titleMatch = articleContent.match(/title:\s*["']([^"']+)["']/);
    const articleTitle = titleMatch ? titleMatch[1] : "";

    // Create search query combining link title and article context
    const searchQuery = `${linkTitle} ${articleTitle}`;

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=5`,
    );

    if (!response.ok) {
      console.error("Google Search API error:", response.status);
      return null;
    }

    const data = await response.json();

    // Get first valid result, prioritizing .gov, .edu, .org domains
    if (data.items && data.items.length > 0) {
      // Sort results to prioritize official domains
      const sortedResults = [...data.items].sort((a, b) => {
        const aIsOfficial = /\.(gov|edu|org)\//.test(a.link);
        const bIsOfficial = /\.(gov|edu|org)\//.test(b.link);
        if (aIsOfficial && !bIsOfficial) return -1;
        if (!aIsOfficial && bIsOfficial) return 1;
        return 0;
      });

      for (const result of sortedResults) {
        // Validate the suggested URL
        const validation = await validateUrl(result.link);
        if (validation.valid) {
          return {
            url: result.link,
            title: result.title,
            snippet: result.snippet || "",
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding replacement link:", error);
    return null;
  }
}
