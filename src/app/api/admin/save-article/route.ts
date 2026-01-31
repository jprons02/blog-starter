import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/admin/session";
import { promises as fs } from "fs";
import path from "path";

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

    const { slug, content } = await request.json();

    if (!slug || !content) {
      return NextResponse.json(
        { error: "Slug and content are required" },
        { status: 400 },
      );
    }

    // Save the file
    const postsDir = path.join(process.cwd(), "content", "posts");
    const filePath = path.join(postsDir, `${slug}.mdx`);

    // Check if file already exists
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: `File already exists: ${slug}.mdx` },
        { status: 409 },
      );
    } catch {
      // File doesn't exist, we can proceed
    }

    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({
      success: true,
      message: `Article saved: ${slug}.mdx`,
      slug,
      filePath: `content/posts/${slug}.mdx`,
    });
  } catch (error) {
    console.error("Error saving article:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save article",
      },
      { status: 500 },
    );
  }
}
