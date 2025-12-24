import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';
import * as argon2 from 'argon2';
import * as QRCode from 'qrcode';
import crypto from 'crypto';

// GET - získání stavu 2FA a QR kódu pro nastavení
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Pokud už je 2FA aktivní, vrátíme jen status
    if (user.twoFactorEnabled) {
      return NextResponse.json({
        enabled: true,
        message: '2FA je již aktivováno',
      });
    }

    // Generujeme nový secret pro nastavení
    const secret = authenticator.generateSecret();
    const appName = 'NatyPetrova Admin';
    const otpAuthUrl = authenticator.keyuri(user.email, appName, secret);

    // Generujeme QR kód
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

    // Uložíme secret dočasně (neaktivováno)
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    return NextResponse.json({
      enabled: false,
      secret,
      qrCode: qrCodeDataUrl,
      manualEntry: secret, // Pro ruční zadání
    });
  } catch (error) {
    console.error('2FA GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get 2FA status' },
      { status: 500 }
    );
  }
}

// POST - aktivace 2FA po ověření kódu
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Neplatný kód. Zadejte 6místný kód z autentikační aplikace.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: 'Nejprve vygenerujte QR kód' },
        { status: 400 }
      );
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA je již aktivováno' },
        { status: 400 }
      );
    }

    // Ověření kódu
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Neplatný kód. Zkuste to znovu.' },
        { status: 400 }
      );
    }

    // Generování záložních kódů pomocí kryptograficky bezpečného RNG
    const backupCodes: string[] = [];
    for (let i = 0; i < 8; i++) {
      // Použití crypto.randomBytes místo Math.random()
      const randomBytes = crypto.randomBytes(5);
      const code = randomBytes.toString('hex').toUpperCase().slice(0, 8);
      backupCodes.push(code);
    }

    // Hash backup codes pro bezpečné uložení
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => argon2.hash(code))
    );

    // Aktivace 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorBackupCodes: JSON.stringify(hashedBackupCodes),
      },
    });

    return NextResponse.json({
      success: true,
      message: '2FA bylo úspěšně aktivováno',
      backupCodes, // Zobrazíme uživateli jednou, aby si je mohl uložit
    });
  } catch (error) {
    console.error('2FA POST error:', error);
    return NextResponse.json(
      { error: 'Failed to enable 2FA' },
      { status: 500 }
    );
  }
}

// DELETE - deaktivace 2FA
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, password } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA není aktivováno' },
        { status: 400 }
      );
    }

    // Ověření hesla
    if (!password) {
      return NextResponse.json(
        { error: 'Zadejte své heslo pro potvrzení' },
        { status: 400 }
      );
    }

    // Guard against null password (OAuth users)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Pro deaktivaci 2FA je nutné mít nastavené heslo. OAuth uživatelé musí nejprve nastavit heslo.' },
        { status: 400 }
      );
    }

    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Nesprávné heslo' },
        { status: 400 }
      );
    }

    // Ověření TOTP kódu
    if (!code) {
      return NextResponse.json(
        { error: 'Zadejte kód z autentikační aplikace' },
        { status: 400 }
      );
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret || '',
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Neplatný kód' },
        { status: 400 }
      );
    }

    // Deaktivace 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: '2FA bylo úspěšně deaktivováno',
    });
  } catch (error) {
    console.error('2FA DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    );
  }
}
