import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

    // Get total sent newsletters
    const totalSent = await prisma.newsletter.count({
      where: {
        status: 'SENT'
      }
    })

    // Get average open rate
    const openRates = await prisma.newsletter.aggregate({
      _avg: {
        openRate: true
      },
      where: {
        status: 'SENT',
        openRate: {
          not: null
        }
      }
    })

    // Get average click rate
    const clickRates = await prisma.newsletter.aggregate({
      _avg: {
        clickRate: true
      },
      where: {
        status: 'SENT',
        clickRate: {
          not: null
        }
      }
    })

    // Get total active subscribers
    const totalSubscribers = await prisma.newsletterSubscriber.count({
      where: {
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      totalSent,
      averageOpenRate: openRates._avg.openRate || 0,
      averageClickRate: clickRates._avg.clickRate || 0,
      totalSubscribers
    })
  } catch (error: any) {
    console.error("Error fetching newsletter stats:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch newsletter stats" },
      { status: 500 }
    )
  }
}
