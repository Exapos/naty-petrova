import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';
import * as argon2 from 'argon2';
import { validatePendingToken, incrementAttempts, invalidateToken } from '@/lib/pending-2fa-tokens';

const MAX_ATTEMPTS = 5;

// POST - ověření 2FA kódu při přihlášení
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { pendingToken?: string; code?: string; isBackupCode?: boolean };
    const { pendingToken, code, isBackupCode } = body;

    if (!pendingToken || !code) {
      return NextResponse.json(
        { error: 'Neplatný požadavek' },
        { status: 400 }
      );
    }

    // Validate the pending token and get userId
    const tokenData = validatePendingToken(pendingToken);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Neplatný nebo vypršelý token. Zkuste se přihlásit znovu.' },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (tokenData.attempts >= MAX_ATTEMPTS) {
      invalidateToken(pendingToken);
      return NextResponse.json(
        { error: 'Příliš mnoho pokusů. Zkuste se přihlásit znovu.' },
        { status: 429 }
      );
    }

    const userId = tokenData.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.twoFactorEnabled) {
      return NextResponse.json(
        { error: 'Uživatel nemá aktivované 2FA' },
        { status: 400 }
      );
    }

    let isValid = false;

    if (isBackupCode) {
      // Ověření záložního kódu
      if (!user.twoFactorBackupCodes) {
        return NextResponse.json(
          { error: 'Žádné záložní kódy nejsou k dispozici' },
          { status: 400 }
        );
      }

      const backupCodes: string[] = JSON.parse(user.twoFactorBackupCodes);
      
      // Zkontrolujeme každý záložní kód
      for (let i = 0; i < backupCodes.length; i++) {
        try {
          const isMatch = await argon2.verify(backupCodes[i], code.toUpperCase());
          if (isMatch) {
            // Odstraníme použitý záložní kód
            backupCodes.splice(i, 1);
            await prisma.user.update({
              where: { id: user.id },
              data: {
                twoFactorBackupCodes: JSON.stringify(backupCodes),
              },
            });
            isValid = true;
            break;
          }
        } catch {
          // Pokračujeme s dalším kódem
        }
      }

      if (!isValid) {
        // Increment failed attempts
        incrementAttempts(pendingToken);
        return NextResponse.json(
          { error: 'Neplatný záložní kód' },
          { status: 400 }
        );
      }
    } else {
      // Ověření TOTP kódu
      if (!user.twoFactorSecret) {
        return NextResponse.json(
          { error: 'Neplatný požadavek' },
          { status: 400 }
        );
      }

      isValid = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        // Increment failed attempts
        incrementAttempts(pendingToken);
        return NextResponse.json(
          { error: 'Neplatný kód. Zkuste to znovu.' },
          { status: 400 }
        );
      }
    }

    // Success - invalidate the pending token (single-use)
    invalidateToken(pendingToken);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při ověřování' },
      { status: 500 }
    );
  }
}
