// Server-side permission utilities
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';

export async function requireRole(requiredRole: 'ADMIN' | 'EDITOR' | 'ADMIN_OR_EDITOR') {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = session.user.role;

  if (requiredRole === 'ADMIN' && userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Access denied - Admin required' }, { status: 403 });
  }

  if (requiredRole === 'EDITOR' && userRole !== 'EDITOR') {
    return NextResponse.json({ error: 'Access denied - Editor required' }, { status: 403 });
  }

  if (requiredRole === 'ADMIN_OR_EDITOR' && userRole !== 'ADMIN' && userRole !== 'EDITOR') {
    return NextResponse.json({ error: 'Access denied - Admin or Editor required' }, { status: 403 });
  }

  return null; // Přístup povolen
}