import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { GoogleAnalyticsService } from '@/lib/analytics';
import { prisma } from '@/lib/prisma';
import { decodePrivateKey } from '@/lib/env-keys';

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

    // Získání konfigurace - priorita: .env > databáze
    const gaPropertyIdDb = await prisma.settings.findUnique({
      where: { key: 'gaPropertyId' }
    });

    const gaEmailDb = await prisma.settings.findUnique({
      where: { key: 'gaServiceAccountEmail' }
    });

    const gaPrivateKeyDb = await prisma.settings.findUnique({
      where: { key: 'gaServiceAccountPrivateKey' }
    });

    // Priorita: environment variable > databáze
    const propertyId = process.env.GA_PROPERTY_ID || gaPropertyIdDb?.value || '';
    const serviceAccountEmail = process.env.GA_SERVICE_ACCOUNT_EMAIL || gaEmailDb?.value || '';
    
    // Dekóduj private key z base64
    let privateKey = '';
    try {
      if (process.env.GA_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64) {
        privateKey = decodePrivateKey(process.env.GA_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64);
      } else if (gaPrivateKeyDb?.value) {
        privateKey = gaPrivateKeyDb.value;
      }
    } catch (error) {
      console.error('Failed to decode private key:', error);
    }

    // Info o zdroji konfigurace pro debugging
    const configSource = {
      propertyId: process.env.GA_PROPERTY_ID ? 'env' : (gaPropertyIdDb?.value ? 'database' : 'none'),
      serviceAccountEmail: process.env.GA_SERVICE_ACCOUNT_EMAIL ? 'env' : (gaEmailDb?.value ? 'database' : 'none'),
      privateKey: process.env.GA_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64 ? 'env-base64' : (gaPrivateKeyDb?.value ? 'database' : 'none'),
    };

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

    const isConfigured = !!(propertyId && serviceAccountEmail && privateKey);

    return NextResponse.json({
      success: true,
      data: analyticsData,
      isRealData: isConfigured,
      configSource,
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