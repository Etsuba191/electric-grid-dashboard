import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const user = (session as any)?.user;
  if (!session || (user?.role !== 'admin' && user?.role !== 'super-admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  // Only admin/super-admin can access this route
  return NextResponse.json({ message: 'You are authorized as admin or super-admin.' });
}