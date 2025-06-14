/**
 * ✅ Unit test for generatePost()
 *
 * This test mocks OpenAI's response and checks that:
 * - Blog metadata is returned correctly
 * - Slug is formatted properly
 * - No real API calls are made
 */

import { describe, it, expect, vi } from "vitest";
import { generatePost } from "@/lib/openai-post";

// 🔧 Mock OpenAI class constructor + completions.create method
vi.mock("openai", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  tool_calls: [
                    {
                      function: {
                        arguments: JSON.stringify({
                          title: "How to Test OpenAI Tools",
                          summary: "A quick guide to testing AI output.",
                          tags: ["openai", "testing", "vitest"],
                          date: "2025-06-13",
                          content: "This is the post content.",
                        }),
                      },
                    },
                  ],
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

describe("generatePost", () => {
  it("returns parsed blog metadata and slug", async () => {
    const result = await generatePost("How to test AI functions");

    expect(result.title).toBe("How to Test OpenAI Tools");
    expect(result.summary).toContain("testing AI output");
    expect(result.slug).toBe("how-to-test-openai-tools");
    expect(result.tags).toEqual(["openai", "testing", "vitest"]);
    expect(result.content).toContain("post content");
  });
});
