import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Získat konkrétní referenci podle slug
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    // Získat referenci pomocí raw SQL
    const references = await prisma.$queryRaw`
      SELECT id, title, slug, location, description, category, image, "createdAt", "updatedAt"
      FROM "Reference"
      WHERE slug = ${slug} AND published = true
    ` as any[];

    if (references.length === 0) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 });
    }

    return NextResponse.json({ reference: references[0] });

  } catch (error) {
    console.error('Error fetching reference by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}