import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Get all newsletters
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

    const newsletters = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        subject: true,
        content: true,
        status: true,
        scheduledFor: true,
        sentAt: true,
        openRate: true,
        clickRate: true,
        createdAt: true,
      },
    })

    return NextResponse.json(newsletters)
  } catch (error: any) {
    console.error("Error fetching newsletters:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch newsletters" },
      { status: 500 }
    )
  }
}

// Create new newsletter
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
    const { subject, content, scheduledFor } = data

    // Validate input
    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      )
    }

    // Create newsletter
    const newsletter = await prisma.newsletter.create({
      data: {
        subject,
        content,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status: scheduledFor ? "SCHEDULED" : "DRAFT",
        userId: session.user.id,
      },
      select: {
        id: true,
        subject: true,
        content: true,
        status: true,
        scheduledFor: true,
        createdAt: true,
      },
    })

    return NextResponse.json(newsletter)
  } catch (error: any) {
    console.error("Error creating newsletter:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create newsletter" },
      { status: 500 }
    )
  }
}
