// In-memory store for pending 2FA tokens (use Redis in production)
const pending2FATokens = new Map<string, { userId: string; createdAt: number; attempts: number }>();

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of pending2FATokens.entries()) {
    // Tokens expire after 5 minutes
    if (now - data.createdAt > 5 * 60 * 1000) {
      pending2FATokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

export function validatePendingToken(token: string): { userId: string; attempts: number } | null {
  const data = pending2FATokens.get(token);
  if (!data) return null;
  
  // Check expiry (5 minutes)
  if (Date.now() - data.createdAt > 5 * 60 * 1000) {
    pending2FATokens.delete(token);
    return null;
  }
  
  return { userId: data.userId, attempts: data.attempts };
}

export function incrementAttempts(token: string): number {
  const data = pending2FATokens.get(token);
  if (!data) return 0;
  data.attempts++;
  return data.attempts;
}

export function invalidateToken(token: string): void {
  pending2FATokens.delete(token);
}

export function storePendingToken(token: string, userId: string): void {
  pending2FATokens.set(token, {
    userId,
    createdAt: Date.now(),
    attempts: 0,
  });
}
