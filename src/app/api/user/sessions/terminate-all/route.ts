import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
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

    // Deaktivovat všechny aktivní sessions pomocí raw SQL
    await prisma.$executeRaw`
      UPDATE "UserSession" 
      SET "isActive" = false 
      WHERE "userId" = ${user.id} AND "isActive" = true
    `;

    return NextResponse.json({ 
      message: 'All sessions terminated successfully' 
    });

  } catch (error) {
    console.error('Terminate all sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}