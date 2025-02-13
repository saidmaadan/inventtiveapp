import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { subMonths, startOfDay, endOfDay } from "date-fns"

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

    // Get subscriber growth data for the last 30 days
    const thirtyDaysAgo = subMonths(new Date(), 1)
    
    const subscriberGrowth = await prisma.newsletterSubscriber.groupBy({
      by: ['subscribedAt'],
      _count: {
        id: true
      },
      where: {
        subscribedAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        subscribedAt: 'asc'
      }
    })

    const unsubscribes = await prisma.newsletterSubscriber.groupBy({
      by: ['updatedAt'],
      _count: {
        id: true
      },
      where: {
        status: 'UNSUBSCRIBED',
        updatedAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        updatedAt: 'asc'
      }
    })

    // Format data for chart
    const growthData = subscriberGrowth.map(day => ({
      date: day.subscribedAt.toISOString(),
      subscribers: day._count.id,
      unsubscribes: unsubscribes.find(
        unsub => 
          unsub.updatedAt.getDate() === day.subscribedAt.getDate() &&
          unsub.updatedAt.getMonth() === day.subscribedAt.getMonth()
      )?._count.id || 0
    }))

    return NextResponse.json(growthData)
  } catch (error: any) {
    console.error("Error fetching subscriber growth:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscriber growth" },
      { status: 500 }
    )
  }
}
