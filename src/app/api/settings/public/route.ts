import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Načtení pouze veřejných nastavení (bez autentizace)
    const settingsData = await prisma.settings.findMany({
      where: {
        key: {
          in: ['googleAnalytics', 'googleTagManager']
        }
      }
    });

    // Převedení na objekt
    const settings: Record<string, string> = {};
    settingsData.forEach(setting => {
      if (setting.value) {
        settings[setting.key] = setting.value;
      }
    });

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Public settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}