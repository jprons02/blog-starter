import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionStore } from "@/lib/admin/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (sessionToken) {
      const sessionStore = getSessionStore();
      sessionStore.delete(sessionToken);
    }

    // Clear the cookie
    cookieStore.delete("admin_session");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
