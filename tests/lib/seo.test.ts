// tests/lib/seo.test.ts

/**
 * ✅ Unit tests for getPostMeta()
 *
 * This file tests the SEO utility function from lib/seo.ts.
 * - Ensures it returns correct Open Graph and Twitter metadata
 * - Validates URL and image formatting based on provided slug and image
 * - Confirms fallback behavior when no image is provided
 */

import { describe, it, expect } from "vitest";
import { getPostMeta } from "@/lib/seo";

describe("getPostMeta", () => {
  /**
   * ✅ Test case: returns expected structure for a complete post
   * - Confirms title, description, Open Graph, Twitter, and URL fields are correct
   */
  it("returns correct metadata structure", () => {
    const result = getPostMeta({
      title: "Test Title",
      description: "Test description goes here.",
      slug: "test-post",
      image: "https://example.com/test-image.jpg",
    });

    // Basic checks
    expect(result.title).toBe("Test Title");
    expect(result.description).toBe("Test description goes here.");

    // ✅ Open Graph fields
    expect(result.openGraph).toMatchObject({
      title: "Test Title",
      description: "Test description goes here.",
      url: expect.stringContaining("/blog/test-post"),
      type: "article",
      images: [{ url: "https://example.com/test-image.jpg" }],
    });

    // ✅ Twitter metadata
    expect(result.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Test Title",
      description: "Test description goes here.",
      images: ["https://example.com/test-image.jpg"],
    });

    // ✅ metadataBase is a URL instance
    expect(result.metadataBase).toBeInstanceOf(URL);
  });

  /**
   * ✅ Test case: falls back to default OG image if none is provided
   */
  it("uses default image if none is provided", () => {
    const result = getPostMeta({
      title: "No Image",
      description: "Fallback test.",
      slug: "no-image-post",
    });

    expect(result.openGraph.images[0].url).toMatch(/default-og\.jpg$/);
    expect(result.twitter.images[0]).toMatch(/default-og\.jpg$/);
  });
});
