import { prisma } from '@/lib/prisma';
import { parseUserAgent, generateSessionToken } from '@/lib/session-utils';

export async function createUserSession(
  userId: string, 
  userAgent?: string, 
  ipAddress?: string
) {
  try {
    const sessionToken = generateSessionToken();
    const parsedUserAgent = parseUserAgent(userAgent || '');
    
    // Use raw SQL to avoid TypeScript errors
    await prisma.$executeRaw`
      INSERT INTO "UserSession" (
        id, "userId", token, "userAgent", "ipAddress", location, 
        "isActive", "lastActivity", "createdAt", "expiresAt"
      ) VALUES (
        gen_random_uuid(), ${userId}, ${sessionToken}, ${parsedUserAgent}, 
        ${ipAddress || 'Unknown'}, 'Česká republika', true, NOW(), NOW(), 
        NOW() + INTERVAL '30 days'
      )
    `;
    
    return { token: sessionToken };
  } catch (error) {
    console.error('Error creating user session:', error);
    return null;
  }
}

export async function updateSessionActivity(sessionToken: string) {
  try {
    await prisma.$executeRaw`
      UPDATE "UserSession" 
      SET "lastActivity" = NOW() 
      WHERE token = ${sessionToken}
    `;
  } catch (error) {
    console.error('Error updating session activity:', error);
  }
}