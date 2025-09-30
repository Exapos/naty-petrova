import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { GoogleAnalyticsService } from '@/lib/analytics';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Ověření administrátorských práv
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Získání konfigurace z databáze nebo environment variables
    const gaPropertyId = await prisma.settings.findUnique({
      where: { key: 'gaPropertyId' }
    });

    const gaEmail = await prisma.settings.findUnique({
      where: { key: 'gaServiceAccountEmail' }
    });

    const gaPrivateKey = await prisma.settings.findUnique({
      where: { key: 'gaServiceAccountPrivateKey' }
    });

    // Property ID z databáze nebo environment variables (pro konzistenci s AnalyticsWrapper)
    const propertyId = gaPropertyId?.value || process.env.GA_PROPERTY_ID || '';
    const serviceAccountEmail = gaEmail?.value || process.env.GA_SERVICE_ACCOUNT_EMAIL || '';
    const privateKey = gaPrivateKey?.value || process.env.GA_SERVICE_ACCOUNT_PRIVATE_KEY || '';

    // Inicializace Analytics Service
    const analyticsService = new GoogleAnalyticsService({
      propertyId,
      serviceAccountEmail,
      privateKey,
    });

    // Získání parametru days z query
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Načtení WebVitals dat
    const webVitalsData = await analyticsService.getWebVitalsData(days);

    const isRealData = !!(propertyId && serviceAccountEmail && privateKey);

    return NextResponse.json({
      success: true,
      data: webVitalsData,
      isRealData,
    });

  } catch (error) {
    console.error('WebVitals API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch WebVitals data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}