import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions';

import { PrismaClient } from '@prisma/client';
import { sanitizeInput } from '@/utils/sanitizeHtml';

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true, email: true } } }
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/blog');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? { user: session.user, role: session.user?.role } : 'No session');
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      console.log('Authorization failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
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
  } = await request.json();
  
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
