import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { prisma } from '@/lib/prisma';
import argon2 from 'argon2';

// GET - Získat všechny uživatele (pouze pro admin)
export async function GET() {
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

    // Získat všechny uživatele pomocí raw SQL
    const users = await prisma.$queryRaw`
      SELECT id, email, name, role, "createdAt"
      FROM "User"
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({ users });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Vytvořit nového uživatele (pouze pro admin)
export async function POST(request: NextRequest) {
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

    // Validace
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password and role are required' },
        { status: 400 }
      );
    }

    if (role !== 'ADMIN' && role !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN or EDITOR' },
        { status: 400 }
      );
    }

    // Ověření, že email již neexistuje
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash hesla
    const hashedPassword = await argon2.hash(password);

    // Vytvořit uživatele pomocí raw SQL
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, password, name, role, "createdAt")
      VALUES (gen_random_uuid(), ${email}, ${hashedPassword}, ${name || null}, ${role}::"Role", NOW())
    `;

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}