import { auth } from "./auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default auth(async (req) => {
  const session = await auth();
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') || 
                      req.nextUrl.pathname.startsWith('/api/admin');

  if (isAdminRoute) {
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login', req.url));
    

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    }
  }
});

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/settings/:path*',
    '/api/protected/:path*',
    // Admin routes
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};
