import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import crypto from 'crypto';
import { parseUserAgent, generateSessionToken } from '@/lib/session-utils';
import { storePendingToken } from '@/lib/pending-2fa-tokens';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email a heslo jsou povinné' },
        { status: 400 }
      );
    }

    // Najít uživatele
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        twoFactorEnabled: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    // Ověřit heslo
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    // Pokud má uživatel aktivované 2FA, vrátíme požadavek na 2FA kód
    if (user.twoFactorEnabled) {
      // Generate a secure, opaque pending token
      const pendingToken = crypto.randomBytes(32).toString('hex');
      
      // Store the mapping (token -> userId) with timestamp
      storePendingToken(pendingToken, user.id);
      
      return NextResponse.json({
        requires2FA: true,
        pendingToken,
        message: 'Zadejte kód z autentikační aplikace',
      });
    }

    // Získání User-Agent a IP adresy z hlaviček
    const userAgentHeader = request.headers.get('user-agent') || 'Unknown';
    const parsedUserAgent = parseUserAgent(userAgentHeader);
    
    // Získání IP adresy
    let ipAddress = 'Unknown';
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const xRealIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    if (cfConnectingIp) {
      ipAddress = cfConnectingIp;
    } else if (xRealIp) {
      ipAddress = xRealIp;
    } else if (xForwardedFor) {
      ipAddress = xForwardedFor.split(',')[0].trim();
    }

    // Vytvořit session token
    const sessionToken = generateSessionToken();

    // Vytvořit session záznam v databázi
    try {
      await prisma.$executeRaw`
        INSERT INTO "UserSession" (
          id, "userId", token, "userAgent", "ipAddress", location, 
          "isActive", "lastActivity", "createdAt", "expiresAt"
        ) VALUES (
          gen_random_uuid(), ${user.id}, ${sessionToken}, ${parsedUserAgent}, 
          ${ipAddress}, 'Česká republika', true, NOW(), NOW(), 
          NOW() + INTERVAL '30 days'
        )
      `;
    } catch (dbError) {
      console.error('Error creating session record:', dbError);
      // Pokračujeme i když se nepodaří vytvořit session záznam
    }

    // Vrátit úspěšnou odpověď - NextAuth se postará o zbytek
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      sessionInfo: {
        token: sessionToken,
        userAgent: parsedUserAgent,
        ipAddress: ipAddress,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při přihlašování' },
      { status: 500 }
    );
  }
}
