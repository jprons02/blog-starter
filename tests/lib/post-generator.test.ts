/**
 * ✅ Unit tests for formatPostToMDX()
 *
 * This suite verifies that the MDX formatting logic:
 * - Correctly outputs valid frontmatter
 * - Escapes and stringifies metadata properly
 * - Handles presence or absence of optional `image`
 * - Includes a heading and post content
 */

import { describe, it, expect } from "vitest";
import { formatPostToMDX } from "@/lib/post-generator";

describe("formatPostToMDX", () => {
  /**
   * ✅ Test: basic formatting with required metadata (no image)
   *
   * Verifies that the function returns:
   * - Proper YAML frontmatter with title, summary, tags, and date
   * - A valid H1 heading for the title
   * - The main content following the frontmatter
   */
  it("formats MDX correctly without image", () => {
    const mdx = formatPostToMDX({
      title: "My Test Post",
      summary: "This is a test summary.",
      tags: ["testing", "mdx"],
      date: "2024-06-13",
      content: "This is the main post content.",
    });

    expect(mdx).toContain('title: "My Test Post"');
    expect(mdx).toContain('summary: "This is a test summary."');
    expect(mdx).toContain('tags: ["testing","mdx"]');
    expect(mdx).toContain('date: "2024-06-13"');
    expect(mdx).not.toContain("image:");
    expect(mdx).toContain("# My Test Post");
    expect(mdx).toContain("This is the main post content.");
  });

  /**
   * ✅ Test: formatting when `image` is provided
   *
   * Ensures the frontmatter includes an image field when specified.
   */
  it("includes image in frontmatter if provided", () => {
    const mdx = formatPostToMDX({
      title: "Image Post",
      summary: "Includes a cover image.",
      tags: ["image"],
      date: "2024-06-13",
      content: "Image content goes here.",
      image: "https://example.com/cover.jpg",
    });

    expect(mdx).toContain('image: "https://example.com/cover.jpg"');
  });

  /**
   * ✅ Test: ensures content is trimmed and inserted after frontmatter
   */
  it("trims and includes content after frontmatter", () => {
    const mdx = formatPostToMDX({
      title: "Trim Test",
      summary: "Test trimming.",
      tags: [],
      date: "2024-06-13",
      content: "   Final content.   \n\n",
    });

    expect(mdx).toMatch(/---\n.*\n---\n\n# Trim Test\n\nFinal content\./s);
  });
});
