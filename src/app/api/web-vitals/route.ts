import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/authOptions';

// POST - uložení Web Vitals metriky z klienta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, rating, page } = body;

    // Validace povinných polí
    if (!name || value === undefined || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: name, value, rating' },
        { status: 400 }
      );
    }

    // Validace názvu metriky
    const validMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'];
    if (!validMetrics.includes(name)) {
      return NextResponse.json(
        { error: `Invalid metric name. Must be one of: ${validMetrics.join(', ')}` },
        { status: 400 }
      );
    }

    // Validace ratingu
    const validRatings = ['good', 'needs-improvement', 'poor'];
    if (!validRatings.includes(rating)) {
      return NextResponse.json(
        { error: `Invalid rating. Must be one of: ${validRatings.join(', ')}` },
        { status: 400 }
      );
    }

    // Validace a konverze hodnoty
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return NextResponse.json(
        { error: 'Invalid value. Must be a valid number.' },
        { status: 400 }
      );
    }

    // Získání User-Agent z hlavičky
    const userAgent = request.headers.get('user-agent') || undefined;

    // Uložení do databáze
    await prisma.webVitalsMetric.create({
      data: {
        name,
        value: numericValue,
        rating,
        page: page || null,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving Web Vitals:', error);
    return NextResponse.json(
      { error: 'Failed to save Web Vitals metric' },
      { status: 500 }
    );
  }
}

// GET - získání agregovaných Web Vitals dat pro admin panel
export async function GET(request: NextRequest) {
  try {
    // Auth check - only admins can view analytics
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Přístup odepřen' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Datum od kterého sbíráme data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Získání všech metrik za dané období
    const metrics = await prisma.webVitalsMetric.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Agregace metrik podle názvu
    const aggregatedMetrics: Record<string, {
      name: string;
      values: number[];
      ratings: string[];
      count: number;
    }> = {};

    metrics.forEach((metric) => {
      if (!aggregatedMetrics[metric.name]) {
        aggregatedMetrics[metric.name] = {
          name: metric.name,
          values: [],
          ratings: [],
          count: 0,
        };
      }
      aggregatedMetrics[metric.name].values.push(metric.value);
      aggregatedMetrics[metric.name].ratings.push(metric.rating);
      aggregatedMetrics[metric.name].count++;
    });

    // Výpočet průměrů a nejčastějšího ratingu
    const result = Object.values(aggregatedMetrics).map((metric) => {
      const avgValue = metric.values.reduce((a, b) => a + b, 0) / metric.values.length;
      
      // Nejčastější rating
      const ratingCounts = metric.ratings.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostCommonRating = Object.entries(ratingCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'good';

      return {
        name: metric.name,
        value: avgValue,
        rating: mostCommonRating as 'good' | 'needs-improvement' | 'poor',
        id: `${metric.name}-${Date.now()}`,
        sampleSize: metric.count,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        metrics: result,
        totalSamples: metrics.length,
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      },
      isRealData: metrics.length > 0,
    });
  } catch (error) {
    console.error('Error fetching Web Vitals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Web Vitals data' },
      { status: 500 }
    );
  }
}
