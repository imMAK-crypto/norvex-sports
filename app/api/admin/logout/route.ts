import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/nvx-panel-7q2/login', req.url));
}
