import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { prisma } from '@/lib/prisma';
import argon2 from 'argon2';

// GET - Získat konkrétního uživatele
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověření, že uživatel je admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied - Admin required' }, { status: 403 });
    }

    // Získat uživatele pomocí raw SQL
    const users = await prisma.$queryRaw`
      SELECT id, email, name, role, "createdAt"
      FROM "User"
      WHERE id = ${userId}
    ` as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat uživatele
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověření, že uživatel je admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied - Admin required' }, { status: 403 });
    }

    const { email, password, name, role } = await request.json();

    // Validace role
    if (role && role !== 'ADMIN' && role !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN or EDITOR' },
        { status: 400 }
      );
    }

    // Zabránit změně vlastního účtu
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot modify your own account' },
        { status: 400 }
      );
    }

    // Ověření, že uživatel existuje
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Aktualizace hesla, pokud je poskytnuto
    let hashedPassword: string | null = null;
    if (password) {
      hashedPassword = await argon2.hash(password);
    }

    // Aktualizace pomocí raw SQL
    if (hashedPassword) {
      await prisma.$executeRaw`
        UPDATE "User" 
        SET email = ${email || existingUser.email}, 
            password = ${hashedPassword}, 
            name = ${name !== undefined ? name : existingUser.name}, 
            role = ${role || existingUser.role}::"Role"
        WHERE id = ${userId}
      `;
    } else {
      await prisma.$executeRaw`
        UPDATE "User" 
        SET email = ${email || existingUser.email}, 
            name = ${name !== undefined ? name : existingUser.name}, 
            role = ${role || existingUser.role}::"Role"
        WHERE id = ${userId}
      `;
    }

    return NextResponse.json({ message: 'User updated successfully' });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Smazat uživatele
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověření, že uživatel je admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied - Admin required' }, { status: 403 });
    }

    // Zabránit smazání vlastního účtu
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Ověření, že uživatel existuje
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Smazání uživatele pomocí raw SQL (CASCADE automaticky smaže sessions)
    await prisma.$executeRaw`
      DELETE FROM "User" WHERE id = ${userId}
    `;

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}