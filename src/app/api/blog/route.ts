import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../app/api/auth/authOptions';

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
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { title, slug, content } = await request.json();
  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const safeContent = sanitizeInput(content);
  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content: safeContent,
      authorId: session.user.id,
      published: true,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
