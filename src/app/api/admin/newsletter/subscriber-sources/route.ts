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

    // Get total subscribers count
    const totalSubscribers = await prisma.newsletterSubscriber.count({
      where: {
        status: 'ACTIVE'
      }
    })

    // Get subscribers by source
    const subscribersBySource = await prisma.newsletterSubscriber.groupBy({
      by: ['source'],
      _count: {
        id: true
      },
      where: {
        status: 'ACTIVE'
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    // Calculate percentages and format data
    const sourceData = subscribersBySource.map(source => ({
      source: source.source,
      count: source._count.id,
      percentage: ((source._count.id / totalSubscribers) * 100).toFixed(1)
    }))

    return NextResponse.json(sourceData)
  } catch (error: any) {
    console.error("Error fetching subscriber sources:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscriber sources" },
      { status: 500 }
    )
  }
}
