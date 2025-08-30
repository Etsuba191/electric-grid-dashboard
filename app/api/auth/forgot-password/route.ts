import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    // Always return success to prevent email enumeration
    return NextResponse.json({ ok: true });
  }

  // Generate a reset token
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  // Save token and expiry to user (add fields if needed)
  await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { resetToken: token, resetTokenExpiry: expires },
  });

  // TODO: Send email with reset link (e.g. `/reset-password?token=...`)
  // For now, just log the link
  console.log(`Reset link: http://localhost:3000/reset-password?token=${token}`);

  return NextResponse.json({ ok: true });
}
