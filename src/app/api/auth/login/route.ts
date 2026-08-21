import { NextRequest, NextResponse } from 'next/server';
import { createSession, timingSafeEqual } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error('ADMIN_USERNAME / ADMIN_PASSWORD not configured');
    return NextResponse.json({ error: 'Admin login is not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const username = body?.username;
  const password = body?.password;

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !timingSafeEqual(username, adminUsername) ||
    !timingSafeEqual(password, adminPassword)
  ) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  await createSession(adminUsername);
  return NextResponse.json({ ok: true });
}
