import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    
    // Basic validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Name validation
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Email format validation
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        verificationToken: true
      }
    });

    if (existingUser) {
      // If user exists but email is not verified, resend verification email
      if (!existingUser.emailVerified) {
        // Generate new verification token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update or create verification token
        if (existingUser.verificationToken) {
          await prisma.verificationToken.update({
            where: { email },
            data: { token, expires }
          });
        } else {
          await prisma.verificationToken.create({
            data: { email, token, expires }
          });
        }

        // Send verification email
        try {
          await sendVerificationEmail(email, token);
          return NextResponse.json(
            { message: 'Verification email sent' },
            { status: 200 }
          );
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          return NextResponse.json(
            { error: 'Account created but failed to send verification email. Please try logging in to resend the verification email.' },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user with verification token
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        verificationToken: {
          create: {
            token,
            expires
          }
        }
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, token);
      return NextResponse.json(
        { message: 'Please check your email to verify your account' },
        { status: 201 }
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { error: 'Account created but failed to send verification email. Please try logging in to resend the verification email.' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
