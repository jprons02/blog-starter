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

    // Extract date from frontmatter to determine folder
    const dateMatch = content.match(/date:\s*["'](\d{4})-(\d{2})-\d{2}["']/);
    if (!dateMatch) {
      return NextResponse.json(
        { error: "Could not extract date from frontmatter" },
        { status: 400 },
      );
    }

    const year = dateMatch[1];
    const month = dateMatch[2];
    const folderName = `${month}-${year}`;

    // Create folder structure: content/posts/MM-YYYY/
    const postsDir = path.join(process.cwd(), "content", "posts");
    const monthYearDir = path.join(postsDir, folderName);
    const filePath = path.join(monthYearDir, `${slug}.mdx`);

    // Check if file already exists
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: `File already exists: ${folderName}/${slug}.mdx` },
        { status: 409 },
      );
    } catch {
      // File doesn't exist, we can proceed
    }

    // Create the month-year directory if it doesn't exist
    await fs.mkdir(monthYearDir, { recursive: true });

    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({
      success: true,
      message: `Article saved: ${folderName}/${slug}.mdx`,
      slug,
      filePath: `content/posts/${folderName}/${slug}.mdx`,
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
