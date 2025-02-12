import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate verification token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 3600000); // 24 hours from now

    // Store the token
    await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    // Send verification email using Resend
    await sendVerificationEmail(email, token);

    return NextResponse.json({
      message: "Verification email sent successfully"
    });
  } catch (error: any) {
    console.error("Send verification email error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
