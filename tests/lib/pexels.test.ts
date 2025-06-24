// tests/lib/pexels.test.ts
import { describe, it, expect, vi } from "vitest";

// Mock node-fetch
import fetch from "node-fetch";
vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

import { searchPexelsImages } from "@/lib/api/pexels";

describe("searchPexelsImages", () => {
  it("returns formatted image results with fallback alt text", async () => {
    const mockedFetch = fetch as unknown as ReturnType<typeof vi.fn>;

    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        photos: [
          {
            alt: "",
            src: { original: "https://example.com/fake-image.jpg" },
            photographer: "Test Photographer",
          },
        ],
      }),
    });

    const results = await searchPexelsImages("nature");

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      url: "https://example.com/fake-image.jpg",
      alt: "Image by Test Photographer",
    });
  });
});
