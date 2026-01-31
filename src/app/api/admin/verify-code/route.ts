import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCodeStore, deleteCode, createSession } from "@/lib/admin/session";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Check if the email matches admin email
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }

    // Get the stored code
    const codeStore = getCodeStore();
    const storedData = codeStore.get(email.toLowerCase());

    if (!storedData) {
      return NextResponse.json(
        { error: "No code found. Please request a new one." },
        { status: 401 },
      );
    }

    // Check if expired
    if (Date.now() > storedData.expires) {
      deleteCode(email);
      return NextResponse.json(
        { error: "Code expired. Please request a new one." },
        { status: 401 },
      );
    }

    // Verify the code
    if (storedData.code !== code) {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }

    // Code is valid - create a session
    deleteCode(email);
    const sessionToken = createSession(email);

    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
