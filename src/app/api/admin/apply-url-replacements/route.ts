import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/admin/session";

interface Replacement {
  oldUrl: string;
  newUrl: string;
  newTitle: string;
}

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

    const { content, replacements } = await request.json();

    if (!content || !replacements || !Array.isArray(replacements)) {
      return NextResponse.json(
        { error: "Content and replacements are required" },
        { status: 400 },
      );
    }

    let updatedContent = content;

    // Apply each replacement
    for (const replacement of replacements as Replacement[]) {
      // Find and replace the old link with the new one in the References section
      const referencesMatch = updatedContent.match(
        /#{1,6}\s*References[\s\S]*?(?=\n#{1,6}|$)/i,
      );

      if (referencesMatch) {
        const referencesSection = referencesMatch[0];

        // Find the specific link and replace it
        const oldLinkRegex = new RegExp(
          `<a\\s+href=["']${replacement.oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>([^<]+)</a>`,
          "gi",
        );

        const updatedReferences = referencesSection.replace(
          oldLinkRegex,
          `<a href="${replacement.newUrl}" target="_blank" rel="noopener noreferrer">${replacement.newTitle}</a>`,
        );

        updatedContent = updatedContent.replace(
          referencesSection,
          updatedReferences,
        );
      }
    }

    return NextResponse.json({
      success: true,
      content: updatedContent,
      replacementsApplied: replacements.length,
    });
  } catch (error) {
    console.error("Error applying URL replacements:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to apply replacements",
      },
      { status: 500 },
    );
  }
}
