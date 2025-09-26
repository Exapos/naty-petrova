import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const gaSetting = await prisma.settings.findUnique({
      where: { key: 'googleAnalytics' }
    });

    return NextResponse.json({
      googleAnalytics: gaSetting?.value || null
    });

  } catch (error) {
    console.error('Google Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}