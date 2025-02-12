import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: { isActive: true }
        });
        return NextResponse.json(
          { message: 'Newsletter subscription reactivated' }
        );
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email }
    });

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const subscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false }
    });

    return NextResponse.json(
      { message: 'Successfully unsubscribed from newsletter' }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}
