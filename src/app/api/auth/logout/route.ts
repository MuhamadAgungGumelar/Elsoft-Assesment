import { NextResponse } from 'next/server';
import { TOKEN_COOKIE_NAME } from '@/lib/constants';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
  return response;
}
