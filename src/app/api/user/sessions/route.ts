import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Získat aktivní relace
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Use raw SQL to get sessions
    const sessions = await prisma.$queryRaw`
      SELECT id, "userAgent", "ipAddress", location, "lastActivity", "createdAt"
      FROM "UserSession"
      WHERE "userId" = ${user.id} AND "isActive" = true AND "expiresAt" > NOW()
      ORDER BY "lastActivity" DESC
    `;

    return NextResponse.json({ sessions });

  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Odhlásit specifickou relaci
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Deaktivovat session using raw SQL
    await prisma.$executeRaw`
      UPDATE "UserSession" 
      SET "isActive" = false 
      WHERE id = ${sessionId} AND "userId" = ${user.id}
    `;

    return NextResponse.json({ message: 'Session terminated successfully' });

  } catch (error) {
    console.error('Session termination error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}