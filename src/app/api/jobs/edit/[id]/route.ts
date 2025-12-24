import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/authOptions';
import { sanitizeText } from '@/lib/sanitize';

// GET - Získat konkrétní pozici podle ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching job position with ID:', id);
    
    const position = await prisma.jobPosition.findUnique({
      where: { id },
    });

    console.log('Found position:', position);
    if (!position) {
      console.log('Position not found for ID:', id);
      return NextResponse.json(
        { error: 'Pozice nenalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json(position);
  } catch (error) {
    console.error('Error fetching job position:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání pozice' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat pozici podle ID (pouze ADMIN)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Přístup odepřen' },
        { status: 403 }
      );
    }

    const { id } = await params;
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

    // Validace typu pozice
    const validJobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
    const sanitizedType = typeof type === 'string' ? type.trim().toUpperCase() : '';
    if (!validJobTypes.includes(sanitizedType)) {
      return NextResponse.json(
        { error: `Neplatný typ pozice. Povolené hodnoty: ${validJobTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Sanitizace vstupů
    const sanitizedData = {
      title: sanitizeText(title),
      location: sanitizeText(location),
      type: sanitizedType as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP',
      department: sanitizeText(department),
      shortDescription: sanitizeText(shortDescription),
      description: sanitizeText(description),
      requirements: sanitizeText(requirements || ''),
      benefits: sanitizeText(benefits || ''),
      salary: salary ? sanitizeText(salary) : null,
      isActive: Boolean(isActive)
    };

    // Získat aktuální pozici pro porovnání titulu
    const currentPosition = await prisma.jobPosition.findUnique({
      where: { id },
      select: { title: true, slug: true }
    });

    if (!currentPosition) {
      return NextResponse.json(
        { error: 'Pozice nenalezena' },
        { status: 404 }
      );
    }

    // Generování nového slug pouze pokud se změnil titul
    let newSlug = currentPosition.slug;
    if (sanitizedData.title !== currentPosition.title) {
      // Transliterace českých znaků
      const translitMap: Record<string, string> = {
        'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n',
        'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
        'Á': 'a', 'Č': 'c', 'Ď': 'd', 'É': 'e', 'Ě': 'e', 'Í': 'i', 'Ň': 'n',
        'Ó': 'o', 'Ř': 'r', 'Š': 's', 'Ť': 't', 'Ú': 'u', 'Ů': 'u', 'Ý': 'y', 'Ž': 'z'
      };
      
      const baseSlug = sanitizedData.title
        .split('')
        .map(char => translitMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Kontrola unikátnosti slug - optimalizace: jednom query všechny matching slugy
      // a pak v paměti najdeme první volný místo 100 sekvenčních queries
      const existingSlugs = await prisma.jobPosition.findMany({
        where: { 
          slug: {
            startsWith: baseSlug // Use indexed pattern
          },
          id: { not: id } // Ignorovat aktuální pozici
        },
        select: { slug: true }
      });
      
      // Přeměň na Set pro O(1) lookup
      const slugSet = new Set(existingSlugs.map(s => s.slug));
      
      let slugToUse = baseSlug;
      
      // Nejdřív zkus baseSlug bez suffixu
      if (!slugSet.has(baseSlug)) {
        slugToUse = baseSlug;
      } else {
        // Pak zkušej s suffixem od 1 do 100
        let suffix = 1;
        let found = false;
        
        while (suffix <= 100) {
          const candidateSlug = `${baseSlug}-${suffix}`;
          if (!slugSet.has(candidateSlug)) {
            slugToUse = candidateSlug;
            found = true;
            break;
          }
          suffix++;
        }
        
        if (!found) {
          return NextResponse.json(
            { error: 'Nepodařilo se vygenerovat unikátní URL slug' },
            { status: 500 }
          );
        }
      }
      
      newSlug = slugToUse;
    }

    const position = await prisma.jobPosition.update({
      where: { id },
      data: {
        ...sanitizedData,
        slug: newSlug,
      },
    });

    return NextResponse.json(position);
  } catch (error) {
    console.error('Error updating job position:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci pozice' },
      { status: 500 }
    );
  }
}

// DELETE - Smazat pozici podle ID (pouze ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Přístup odepřen' },
        { status: 403 }
      );
    }

    const { id } = await params;

    await prisma.jobPosition.delete({
      where: { id },
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
