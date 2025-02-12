import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        category: true
      }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const blog = await prisma.blog.findUnique({
      where: { slug: params.slug },
      select: { authorId: true }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (blog.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { title, content, categoryId, featuredImage, isFeatured, isPublished } = await req.json();

    // Create new slug if title is changed
    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      : params.slug;

    const updatedBlog = await prisma.blog.update({
      where: { slug: params.slug },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(categoryId && { categoryId }),
        ...(featuredImage && { featuredImage }),
        ...(typeof isFeatured === 'boolean' && { isFeatured }),
        ...(typeof isPublished === 'boolean' && { 
          isPublished,
          publishedAt: isPublished ? new Date() : null
        }),
        ...(title && { slug })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        category: true
      }
    });

    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const blog = await prisma.blog.findUnique({
      where: { slug: params.slug },
      select: { authorId: true }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or admin
    if (blog.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.blog.delete({
      where: { slug: params.slug }
    });

    return NextResponse.json(
      { message: 'Blog deleted successfully' }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
