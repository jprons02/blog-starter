import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionStore } from "@/lib/admin/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessionStore = getSessionStore();
    const session = sessionStore.get(sessionToken);

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (Date.now() > session.expires) {
      sessionStore.delete(sessionToken);
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      email: session.email,
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
