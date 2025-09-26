import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { prisma } from '@/lib/prisma';
import { canAccessReferences } from '@/lib/permissions';

// GET - Získat všechny reference
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověření oprávnění
    if (!canAccessReferences(session.user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Získat všechny reference pomocí Prisma ORM
    const references = await prisma.reference.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        description: true,
        category: true,
        image: true,
        published: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(references);

  } catch (error) {
    console.error('Error fetching references:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Vytvořit novou referenci
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověření oprávnění
    if (!canAccessReferences(session.user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { title, slug, location, description, category, image, published = true } = await request.json();

    // Validace
    if (!title || !slug || !location || !description || !category) {
      return NextResponse.json(
        { error: 'Title, slug, location, description and category are required' },
        { status: 400 }
      );
    }

    // Ověření, že slug již neexistuje
    const existingReference = await prisma.reference.findUnique({
      where: { slug }
    });

    if (existingReference) {
      return NextResponse.json(
        { error: 'Reference with this slug already exists' },
        { status: 409 }
      );
    }

    // Vytvořit referenci pomocí Prisma ORM
    const newReference = await prisma.reference.create({
      data: {
        title,
        slug,
        location,
        description,
        category,
        image: image || '',
        published
      },
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        description: true,
        category: true,
        image: true,
        published: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(
      { message: 'Reference created successfully', reference: newReference },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating reference:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}