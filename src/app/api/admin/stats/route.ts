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

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get total blogs
    const totalBlogs = await prisma.blog.count()

    // Get total newsletter subscribers (assuming we have a Newsletter model)
    const totalSubscribers = await prisma.newsletter.count()

    // Get active users (users who have logged in in the last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const activeUsers = await prisma.session.groupBy({
      by: ['userId'],
      where: {
        sessionToken: {
          not: null
        },
        expires: {
          gte: sevenDaysAgo
        }
      },
      _count: true
    }).then(result => result.length)

    return NextResponse.json({
      totalUsers,
      totalBlogs,
      totalSubscribers,
      activeUsers
    })
  } catch (error: any) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    )
  }
}
