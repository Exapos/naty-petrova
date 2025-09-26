import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../authOptions';
import { PrismaClient } from '@prisma/client';
import { sanitizeInput } from '@/utils/sanitizeHtml';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('PUT /api/blog/[id] - ID:', id);
    
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
  } = await req.json();
  
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }
  
  const safeContent = sanitizeInput(content);
  
  const post = await prisma.blogPost.update({
    where: { id },
    data: { 
      title, 
      slug, 
      content: safeContent,
      ...(excerpt !== undefined && { excerpt }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(keywords !== undefined && { keywords }),
      ...(published !== undefined && { published }),
      ...(editorMode !== undefined && { editorMode }),
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
  return NextResponse.json(post);
  } catch (error) {
    console.error('PUT /api/blog/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
