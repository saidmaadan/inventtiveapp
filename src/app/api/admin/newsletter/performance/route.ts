import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { subMonths } from "date-fns"

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

    // Get newsletters sent in the last 30 days
    const thirtyDaysAgo = subMonths(new Date(), 1)
    
    const newsletters = await prisma.newsletter.findMany({
      where: {
        sentAt: {
          gte: thirtyDaysAgo
        },
        status: 'SENT'
      },
      orderBy: {
        sentAt: 'asc'
      },
      select: {
        sentAt: true,
        openRate: true,
        clickRate: true
      }
    })

    // Format data for chart
    const performanceData = newsletters.map(newsletter => ({
      date: newsletter.sentAt?.toISOString(),
      openRate: newsletter.openRate || 0,
      clickRate: newsletter.clickRate || 0
    }))

    return NextResponse.json(performanceData)
  } catch (error: any) {
    console.error("Error fetching newsletter performance:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch newsletter performance" },
      { status: 500 }
    )
  }
}
