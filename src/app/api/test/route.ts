import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({ 
    message: 'API is working', 
    timestamp: new Date().toISOString(),
    session: session ? { user: session.user, role: session.user?.role } : null
  });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({ 
    message: 'POST is working', 
    timestamp: new Date().toISOString(),
    session: session ? { user: session.user, role: session.user?.role } : null
  });
}