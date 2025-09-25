import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/authOptions';
import { sanitizeText } from '@/lib/sanitize';

// GET - Získat konkrétní pozici podle slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const position = await prisma.jobPosition.findUnique({
      where: { slug },
    });

    if (!position) {
      return NextResponse.json(
        { error: 'Pozice nenalezena' },
        { status: 404 }
      );
    }

    // Pokud pozice není aktivní, zobrazit pouze adminům
    if (!position.isActive) {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Pozice nenalezena' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ position });
  } catch (error) {
    console.error('Error fetching job position:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání pozice' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat pozici (pouze ADMIN)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Přístup odepřen' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const body = await request.json();
    const {
      title,
      location,
      type,
      department,
      shortDescription,
      description,
      requirements,
      benefits,
      salary,
      isActive
    } = body;

    // Validace povinných polí
    if (!title || !location || !type || !department || !shortDescription || !description) {
      return NextResponse.json(
        { error: 'Všechna povinná pole musí být vyplněna' },
        { status: 400 }
      );
    }

    // Sanitizace vstupů
    const sanitizedData = {
      title: sanitizeText(title),
      location: sanitizeText(location),
      type,
      department: sanitizeText(department),
      shortDescription: sanitizeText(shortDescription),
      description: sanitizeText(description),
      requirements: sanitizeText(requirements || ''),
      benefits: sanitizeText(benefits || ''),
      salary: salary ? sanitizeText(salary) : null,
      isActive: Boolean(isActive)
    };

    // Generování nového slug pokud se změnil titul
    const newSlug = sanitizedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const position = await prisma.jobPosition.update({
      where: { slug },
      data: {
        ...sanitizedData,
        slug: newSlug,
      },
    });

    return NextResponse.json({ position });
  } catch (error) {
    console.error('Error updating job position:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci pozice' },
      { status: 500 }
    );
  }
}

// DELETE - Smazat pozici (pouze ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Přístup odepřen' },
        { status: 403 }
      );
    }

    const { slug } = await params;

    await prisma.jobPosition.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Pozice byla úspěšně smazána' });
  } catch (error) {
    console.error('Error deleting job position:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání pozice' },
      { status: 500 }
    );
  }
}