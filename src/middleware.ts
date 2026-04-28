import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE_NAME } from './lib/constants';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith('/dashboard');
  const isLogin = pathname.startsWith('/login');
  const isApi = pathname.startsWith('/api');

  if (isApi) return NextResponse.next();

  if (isDashboard && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
