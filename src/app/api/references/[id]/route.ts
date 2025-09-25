import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { prisma } from '@/lib/prisma';
import { canAccessReferences } from '@/lib/permissions';

// GET - Získat konkrétní referenci
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověření oprávnění
    if (!canAccessReferences(session.user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Získat referenci pomocí raw SQL
    const references = await prisma.$queryRaw`
      SELECT id, title, slug, location, description, category, image, published, "createdAt", "updatedAt"
      FROM "Reference"
      WHERE id = ${id}
    ` as any[];

    if (references.length === 0) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 });
    }

    return NextResponse.json(references[0]);

  } catch (error) {
    console.error('Error fetching reference:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat referenci
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověření oprávnění
    if (!canAccessReferences(session.user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { title, slug, location, description, category, image, published } = await request.json();

    // Ověření, že reference existuje
    const existingReference = await prisma.reference.findUnique({
      where: { id: id }
    });

    if (!existingReference) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 });
    }

    // Ověření, že slug není již použit jinou referencí
    if (slug && slug !== existingReference.slug) {
      const slugExists = await prisma.reference.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Reference with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Aktualizace pomocí raw SQL
    await prisma.$executeRaw`
      UPDATE "Reference" 
      SET title = ${title || existingReference.title}, 
          slug = ${slug || existingReference.slug},
          location = ${location || existingReference.location},
          description = ${description || existingReference.description},
          category = ${category || existingReference.category},
          image = ${image !== undefined ? image : existingReference.image},
          published = ${published !== undefined ? published : existingReference.published},
          "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Reference updated successfully' });

  } catch (error) {
    console.error('Error updating reference:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Smazat referenci
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověření oprávnění
    if (!canAccessReferences(session.user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Ověření, že reference existuje
    const existingReference = await prisma.reference.findUnique({
      where: { id: id }
    });

    if (!existingReference) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 });
    }

    // Smazání reference pomocí raw SQL
    await prisma.$executeRaw`
      DELETE FROM "Reference" WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Reference deleted successfully' });

  } catch (error) {
    console.error('Error deleting reference:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}