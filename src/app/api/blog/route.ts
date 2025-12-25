import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions';
import { prisma } from '@/lib/prisma';
import { sanitizeInput } from '@/utils/sanitizeHtml';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, email: true, bio: true, title: true } } }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /api/blog error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
  const body = await request.json();
  
  const { 
    title, 
    slug, 
    content, 
    excerpt, 
    featuredImage,
    metaTitle, 
    metaDescription, 
    keywords, 
    published,
    editorMode 
  } = body;
  
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  
  // Allow empty content for drafts, but require content for published posts
  if (!content && published) {
    console.log('Validation failed: Content is required for published posts');
    return NextResponse.json({ error: 'Content is required for published posts' }, { status: 400 });
  }
  
  // Generate slug if not provided
  const finalSlug = slug || title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const safeContent = sanitizeInput(content);
  
  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: finalSlug,
      content: safeContent,
      ...(excerpt && { excerpt }),
      ...(featuredImage && { featuredImage }),
      ...(metaTitle && { metaTitle }),
      ...(metaDescription && { metaDescription }),
      ...(keywords && { keywords }),
      published: published ?? false,
      editorMode: editorMode || 'wysiwyg',
      authorId: session.user.id,
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
  
  return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 });
  }
}
