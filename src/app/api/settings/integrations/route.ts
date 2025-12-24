import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { prisma } from '@/lib/prisma';

// Mapování klíčů na environment variables
const ENV_MAPPING: Record<string, string> = {
  googleAnalytics: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  facebookPixel: 'NEXT_PUBLIC_FB_PIXEL_ID',
  googleTagManager: 'NEXT_PUBLIC_GTM_ID',
  hotjar: 'NEXT_PUBLIC_HOTJAR_ID',
  mailchimp: 'MAILCHIMP_API_KEY',
  gaServiceAccountEmail: 'GA_SERVICE_ACCOUNT_EMAIL',
  gaServiceAccountPrivateKey: 'GA_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64',
  gaPropertyId: 'GA_PROPERTY_ID',
};

// Pomocná funkce pro získání hodnoty (priorita: .env > databáze)
function getIntegrationValue(key: string, dbValue: string | null): { value: string; source: 'env' | 'database' | 'none' } {
  const envKey = ENV_MAPPING[key];
  const envValue = envKey ? process.env[envKey] : undefined;
  
  if (envValue && envValue.trim() !== '') {
    return { value: envValue, source: 'env' };
  }
  if (dbValue && dbValue.trim() !== '') {
    return { value: dbValue, source: 'database' };
  }
  return { value: '', source: 'none' };
}

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

    // Uložení každé integrace do databáze (pokud není v .env)
    const savedKeys: string[] = [];
    const skippedKeys: string[] = [];

    for (const [key, value] of Object.entries(integrations)) {
      const envKey = ENV_MAPPING[key];
      const envValue = envKey ? process.env[envKey] : undefined;
      
      // Pokud je hodnota v .env, přeskočíme ukládání do databáze
      if (envValue && envValue.trim() !== '') {
        skippedKeys.push(key);
        continue;
      }

      await prisma.settings.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string }
      });
      savedKeys.push(key);
    }

    // Logování s maskováním sensitive údajů
    const logIntegrations = { ...integrations };
    if (logIntegrations.gaServiceAccountPrivateKey) {
      logIntegrations.gaServiceAccountPrivateKey = '***MASKED***';
    }
    console.log('Integrations saved for user:', session.user.email, {
      saved: savedKeys,
      skipped: skippedKeys,
      values: logIntegrations
    });

    return NextResponse.json({
      message: 'Integrations updated successfully',
      savedKeys,
      skippedKeys,
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

    // Vytvoření mapy databázových hodnot
    const dbValues: Record<string, string | null> = {};
    settingsData.forEach(setting => {
      dbValues[setting.key] = setting.value;
    });

    // Integrace s informací o zdroji hodnoty
    const integrations: Record<string, string> = {};
    const sources: Record<string, 'env' | 'database' | 'none'> = {};
    const envVariables: Record<string, string> = {};

    const keys = ['googleAnalytics', 'facebookPixel', 'googleTagManager', 'hotjar', 'mailchimp', 'gaServiceAccountEmail', 'gaServiceAccountPrivateKey', 'gaPropertyId'];

    keys.forEach(key => {
      const result = getIntegrationValue(key, dbValues[key] || null);
      // Maskuj private key - nezobrazuj celou hodnotu
      if (key === 'gaServiceAccountPrivateKey' && result.value) {
        integrations[key] = result.source === 'env' ? '[Nastaveno v .env - BASE64]' : '[Nastaveno v databázi]';
      } else {
        integrations[key] = result.value;
      }
      sources[key] = result.source;
      envVariables[key] = ENV_MAPPING[key];
    });

    return NextResponse.json({
      integrations,
      sources,
      envVariables
    });

  } catch (error) {
    console.error('Integrations fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}