import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get subscribers ordered by most recent first
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        subscribedAt: 'desc'
      },
      take: 100 // Limit to most recent 100 subscribers
    })

    return NextResponse.json(subscribers)
  } catch (error: any) {
    console.error("Error fetching subscribers:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscribers" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await req.json()
    const { email, name, source = "ADMIN" } = data

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === "ACTIVE") {
        return NextResponse.json(
          { error: "Email is already subscribed" },
          { status: 400 }
        )
      }

      // Reactivate unsubscribed subscriber
      const updatedSubscriber = await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          status: "ACTIVE",
          name: name || existingSubscriber.name,
          source
        }
      })

      // Send welcome back email
      await resend.emails.send({
        from: "Inventtive <newsletter@inventtive.io>",
        to: email,
        subject: "Welcome Back to Inventtive Newsletter!",
        html: `
          <h1>Welcome Back!</h1>
          <p>We're glad to have you back on our newsletter list.</p>
          <p>You'll start receiving our updates again.</p>
        `
      })

      return NextResponse.json(updatedSubscriber)
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        source
      }
    })

    // Send welcome email
    await resend.emails.send({
      from: "Inventtive <newsletter@inventtive.io>",
      to: email,
      subject: "Welcome to Inventtive Newsletter!",
      html: `
        <h1>Welcome to Inventtive Newsletter!</h1>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll receive updates about our latest content and features.</p>
      `
    })

    return NextResponse.json(subscriber)
  } catch (error: any) {
    console.error("Error creating subscriber:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create subscriber" },
      { status: 500 }
    )
  }
}
