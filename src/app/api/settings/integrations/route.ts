import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Pouze admin může ukládat integrace
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied - Admin required' }, { status: 403 });
    }

    const integrations = await request.json();

    // Uložení každé integrace do databáze
    for (const [key, value] of Object.entries(integrations)) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string }
      });
    }

    // Logování s maskovacím sensitive údajů
    const logIntegrations = { ...integrations };
    if (logIntegrations.gaServiceAccountPrivateKey) {
      logIntegrations.gaServiceAccountPrivateKey = '***MASKED***';
    }
    console.log('Integrations saved for user:', session.user.email, logIntegrations);

    return NextResponse.json({
      message: 'Integrations updated successfully',
      integrations
    });

  } catch (error) {
    console.error('Integrations update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Načtení integrací z databáze
    const settingsData = await prisma.settings.findMany({
      where: {
        key: {
          in: ['googleAnalytics', 'facebookPixel', 'googleTagManager', 'hotjar', 'mailchimp', 'gaServiceAccountEmail', 'gaServiceAccountPrivateKey', 'gaPropertyId']
        }
      }
    });

    // Převedení na objekt
    const integrations = {
      googleAnalytics: '',
      facebookPixel: '',
      googleTagManager: '',
      hotjar: '',
      mailchimp: '',
      gaServiceAccountEmail: '',
      gaServiceAccountPrivateKey: '',
      gaPropertyId: '',
    };

    settingsData.forEach(setting => {
      if (setting.key in integrations) {
        (integrations as any)[setting.key] = setting.value || '';
      }
    });

    return NextResponse.json({
      integrations
    });

  } catch (error) {
    console.error('Integrations fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}