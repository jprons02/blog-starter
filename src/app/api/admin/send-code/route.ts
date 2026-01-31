import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { setCode } from "@/lib/admin/session";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("ADMIN_EMAIL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Check if the email matches the allowed admin email
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      // Don't reveal that the email is not authorized
      // Return success to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: "If this email is registered, you will receive a code",
      });
    }

    // Generate a 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();

    // Store the code using the shared session module
    setCode(email, code);

    // Send the code via email
    // For now, we'll use the existing sendEmail API or you can integrate with your email service
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
    });
  } catch (error) {
    console.error("Error sending code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function sendVerificationEmail(
  email: string,
  code: string,
): Promise<boolean> {
  try {
    // Use your existing email service or AWS Lambda
    const API_ENDPOINT =
      process.env.EMAIL_API_ENDPOINT ||
      "https://xjsx1og5tf.execute-api.us-east-1.amazonaws.com/prod/contact";
    const API_KEY =
      process.env.EMAIL_API_KEY || process.env.NEXT_PUBLIC_LAMBDA_BLOG_API_KEY;

    if (!API_KEY) {
      console.error("Email API key not configured");
      // In development, log the code instead
      if (process.env.NODE_ENV === "development") {
        console.log("=================================");
        console.log(`ADMIN LOGIN CODE: ${code}`);
        console.log("=================================");
        return true;
      }
      return false;
    }

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        name: "Admin Login",
        email: email,
        message: `Your admin login code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send email:", await response.text());
      // In development, still log the code
      if (process.env.NODE_ENV === "development") {
        console.log("=================================");
        console.log(`ADMIN LOGIN CODE: ${code}`);
        console.log("=================================");
        return true;
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    // In development, log the code
    if (process.env.NODE_ENV === "development") {
      console.log("=================================");
      console.log(`ADMIN LOGIN CODE: ${code}`);
      console.log("=================================");
      return true;
    }
    return false;
  }
}
