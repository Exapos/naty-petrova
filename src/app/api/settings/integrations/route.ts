import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';

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

    // Pro teď jen vracíme úspěch - později by se uložilo do databáze
    // nebo konfiguračního souboru
    console.log('Integrations saved for user:', session.user.email, integrations);

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

    // Pro teď vracíme prázdné integrace - později by se načetlo z databáze
    const integrations = {
      googleAnalytics: '',
      facebookPixel: '',
      googleTagManager: '',
      hotjar: '',
      mailchimp: '',
    };

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