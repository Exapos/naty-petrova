import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/authOptions';
import { sanitizeText } from '@/lib/sanitize';

// GET - Získat všechny pozice (veřejné API)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const includeInactive = url.searchParams.get('includeInactive') === 'true';

    const whereClause = includeInactive ? {} : { isActive: true };

    const positions = await prisma.jobPosition.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Error fetching job positions:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání pozic' },
      { status: 500 }
    );
  }
}

// POST - Vytvořit novou pozici (pouze ADMIN)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Přístup odepřen' },
        { status: 403 }
      );
    }

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
      isActive = true
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

    // Generování slug z titulu
    const slug = sanitizedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const position = await prisma.jobPosition.create({
      data: {
        ...sanitizedData,
        slug,
      },
    });

    return NextResponse.json({ position }, { status: 201 });
  } catch (error) {
    console.error('Error creating job position:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření pozice' },
      { status: 500 }
    );
  }
}