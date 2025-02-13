import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Get newsletter
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: params.id }
    })

    if (!newsletter) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 }
      )
    }

    // Get active subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { status: "ACTIVE" },
      select: { email: true, name: true }
    })

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found" },
        { status: 400 }
      )
    }

    // Send newsletter to all subscribers
    await Promise.all(
      subscribers.map(async (subscriber) => {
        await resend.emails.send({
          from: "Inventtive <newsletter@inventtive.io>",
          to: subscriber.email,
          subject: newsletter.subject,
          html: newsletter.content,
        })
      })
    )

    // Update newsletter status
    const updatedNewsletter = await prisma.newsletter.update({
      where: { id: params.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      }
    })

    return NextResponse.json(updatedNewsletter)
  } catch (error: any) {
    console.error("Error sending newsletter:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send newsletter" },
      { status: 500 }
    )
  }
}
