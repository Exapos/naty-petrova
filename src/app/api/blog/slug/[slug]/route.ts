import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BlogBlock } from '@/types/blog';

// GET blog post by slug with navigation and related posts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Get the current post
    const post = await prisma.blogPost.findUnique({
      where: { 
        slug: slug,
        published: true, // Only published posts
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Get all published posts ordered by creation date for navigation
    const allPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        slug: true, 
        title: true, 
        createdAt: true,
        excerpt: true
      }
    });

    // Find current post index
    const currentIndex = allPosts.findIndex(p => p.slug === slug);
    const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    // Get related posts (exclude current post, limit to 3)
    const relatedPosts = allPosts
      .filter(p => p.slug !== slug)
      .slice(0, 3);

    const navigation = {
      previous: previousPost,
      next: nextPost
    };

    const cleanPost = {
      ...post,
      content: post.content || '',
      blocks: undefined as BlogBlock[] | undefined,
      globalStyles: undefined as any,
    };

    if (post.editorMode === 'block' && post.content) {
      try {
        const parsed = JSON.parse(post.content);
        cleanPost.blocks = parsed.blocks || [];
        cleanPost.globalStyles = parsed.globalStyles || {};
      } catch (error) {
        console.error('Failed to parse block content', error);
      }
    }

    return NextResponse.json({
      ...cleanPost,
      navigation,
      relatedPosts,
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}