import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { escapeSqlLike, sanitizeText } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Sanitizace vstupních parametrů
    const sanitizedCategory = category ? sanitizeText(category.trim()) : null;
    const sanitizedSearch = search ? sanitizeText(search.trim()) : null;

    // Sestavení WHERE podmínky
    let whereCondition = 'WHERE published = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (sanitizedCategory && sanitizedCategory !== 'all') {
      whereCondition += ` AND category = $${paramIndex}`;
      params.push(sanitizedCategory);
      paramIndex++;
    }

    if (sanitizedSearch) {
      const escapedSearch = escapeSqlLike(sanitizedSearch);
      whereCondition += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR location ILIKE $${paramIndex})`;
      params.push(`%${escapedSearch}%`);
      paramIndex++;
    }

    // Získání referencí pomocí raw SQL
    const query = `
      SELECT id, title, slug, location, description, category, image, "createdAt"
      FROM "Reference"
      ${whereCondition}
      ORDER BY "createdAt" DESC
    `;

    const references = await prisma.$queryRawUnsafe(query, ...params) as any[];

    // Získání seznamu kategorií
    const categoriesQuery = `
      SELECT DISTINCT category
      FROM "Reference" 
      WHERE published = true AND category IS NOT NULL AND category != ''
      ORDER BY category
    `;

    const categoryResults = await prisma.$queryRawUnsafe(categoriesQuery) as any[];
    const categories = categoryResults.map(result => result.category);

    // Statistiky
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN category = 'Bytové domy' THEN 1 END) as bytove_domy,
        COUNT(CASE WHEN category = 'Rodinné domy' THEN 1 END) as rodinne_domy,
        COUNT(CASE WHEN category = 'Komerční objekty' THEN 1 END) as komercni_objekty,
        COUNT(CASE WHEN category = 'Průmyslové objekty' THEN 1 END) as prumyslove_objekty,
        COUNT(CASE WHEN category = 'Rekonstrukce' THEN 1 END) as rekonstrukce,
        COUNT(CASE WHEN category = 'Interiéry' THEN 1 END) as interiery,
        COUNT(CASE WHEN category = 'Infrastruktura' THEN 1 END) as infrastruktura,
        COUNT(CASE WHEN category = 'Ostatní' THEN 1 END) as ostatni
      FROM "Reference" 
      WHERE published = true
    `;

    const stats = await prisma.$queryRawUnsafe(statsQuery) as any[];

    // Konverze BigInt na Number pro JSON serialization
    const convertedStats = stats[0] ? {
      total: Number(stats[0].total),
      bytove_domy: Number(stats[0].bytove_domy),
      rodinne_domy: Number(stats[0].rodinne_domy),
      komercni_objekty: Number(stats[0].komercni_objekty),
      prumyslove_objekty: Number(stats[0].prumyslove_objekty),
      rekonstrukce: Number(stats[0].rekonstrukce),
      interiery: Number(stats[0].interiery),
      infrastruktura: Number(stats[0].infrastruktura),
      ostatni: Number(stats[0].ostatni)
    } : {};

    return NextResponse.json({
      references,
      categories,
      stats: convertedStats,
      pagination: {
        total: references.length,
        page: 1,
        limit: references.length
      }
    });

  } catch (error) {
    console.error('Error fetching public references:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}