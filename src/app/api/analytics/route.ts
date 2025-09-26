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

    // Property ID z databáze (bez fallback - musí být explicitně nastaveno)
    const propertyId = gaPropertyId?.value || '';
    const serviceAccountEmail = gaEmail?.value || '';
    const privateKey = gaPrivateKey?.value || '';



    // Inicializace Analytics Service
    const analyticsService = new GoogleAnalyticsService({
      propertyId,
      serviceAccountEmail,
      privateKey,
    });

    // Získání parametru days z query
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Načtení analytics dat
    const analyticsData = await analyticsService.getAnalyticsData(days);

    return NextResponse.json({
      success: true,
      data: analyticsData,
      isRealData: !!(propertyId && serviceAccountEmail && privateKey),
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}