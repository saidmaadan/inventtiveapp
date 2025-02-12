import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link"
      });
    }

    // Generate reset token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    // Send reset email using Resend
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset link"
    });
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
