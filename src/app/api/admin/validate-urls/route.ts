import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/admin/session";
import {
  validateUrl,
  extractReferencesFromMdx,
  findReplacementLink,
  type UrlValidationResult,
} from "@/lib/admin/validateUrls";

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = getSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    // Extract reference links with context
    const links = extractReferencesFromMdx(content);

    if (links.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        message: "No reference URLs found to validate",
      });
    }

    // Validate each URL and find replacements for broken ones
    const results: UrlValidationResult[] = await Promise.all(
      links.map(async (link) => {
        const validation = await validateUrl(link.url);

        // If broken, try to find a replacement
        if (!validation.valid) {
          const replacement = await findReplacementLink(
            link.url,
            link.title,
            content,
          );

          return {
            ...validation,
            linkContext: link.title,
            suggestedReplacement: replacement || undefined,
          };
        }

        return {
          ...validation,
          linkContext: link.title,
        };
      }),
    );

    const invalidUrls = results.filter((r) => !r.valid);
    const fixableUrls = invalidUrls.filter((r) => r.suggestedReplacement);

    return NextResponse.json({
      success: true,
      results,
      totalUrls: links.length,
      validUrls: results.filter((r) => r.valid).length,
      invalidUrls: invalidUrls.length,
      fixableUrls: fixableUrls.length,
      message:
        invalidUrls.length === 0
          ? "All reference links are valid"
          : fixableUrls.length > 0
            ? `Found ${fixableUrls.length} replacement(s) for broken link(s)`
            : `Found ${invalidUrls.length} broken link(s)`,
    });
  } catch (error) {
    console.error("Error validating URLs:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to validate URLs",
      },
      { status: 500 },
    );
  }
}
