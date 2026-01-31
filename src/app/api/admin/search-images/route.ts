import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/admin/session";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
  };
  photographer: string;
  photographer_url: string;
  photographer_id: number;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

    if (!PEXELS_API_KEY) {
      return NextResponse.json(
        { error: "Pexels API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=12&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Pexels" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as PexelsResponse;

    // Transform to simpler format for frontend
    const photos = data.photos.map((photo) => ({
      id: photo.id,
      url: photo.src.large, // Use large for preview
      originalUrl: photo.src.original,
      alt: photo.alt || `Photo by ${photo.photographer}`,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      width: photo.width,
      height: photo.height,
    }));

    return NextResponse.json({
      photos,
      totalResults: data.total_results,
      page: data.page,
      perPage: data.per_page,
    });
  } catch (error) {
    console.error("Error searching Pexels:", error);
    return NextResponse.json(
      { error: "Failed to search images" },
      { status: 500 },
    );
  }
}
