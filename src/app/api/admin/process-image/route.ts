import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/admin/session";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

interface ProcessImageRequest {
  imageUrl: string;
  slug: string;
  photographer: string;
  photographerUrl: string;
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

    const {
      imageUrl,
      slug,
      photographer,
      photographerUrl,
    }: ProcessImageRequest = await request.json();

    if (!imageUrl || !slug) {
      return NextResponse.json(
        { error: "Image URL and slug are required" },
        { status: 400 },
      );
    }

    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to download image" },
        { status: 500 },
      );
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Process image with sharp: resize to 1200x800 and convert to JPEG
    const processedImage = await sharp(imageBuffer)
      .resize(1200, 800, {
        fit: "cover",
        position: "center",
      })
      .jpeg({
        quality: 85,
        progressive: true,
      })
      .toBuffer();

    // Save to public/images/postImages/
    const imagesDir = path.join(
      process.cwd(),
      "public",
      "images",
      "postImages",
    );

    // Ensure directory exists
    await fs.mkdir(imagesDir, { recursive: true });

    const filename = `${slug}.jpg`;
    const filePath = path.join(imagesDir, filename);

    await fs.writeFile(filePath, processedImage);

    // Return the data needed for frontmatter
    return NextResponse.json({
      success: true,
      image: `/images/postImages/${filename}`,
      imageCreditName: photographer,
      imageCreditUrl: photographerUrl,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process image",
      },
      { status: 500 },
    );
  }
}
