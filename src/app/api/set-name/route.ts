import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Najdeme prvního uživatele a nastavíme mu jméno
    const users = await prisma.user.findMany({ take: 1 });
    
    if (users.length > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: users[0].id },
        data: { name: 'Naťa Petrova' },
        select: { id: true, email: true, name: true, role: true }
      });
      
      return NextResponse.json({
        message: 'User name updated successfully',
        user: updatedUser
      });
    } else {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}