import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET published blog posts for public display
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6, // Limit to 6 latest posts
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /api/blog/public error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
