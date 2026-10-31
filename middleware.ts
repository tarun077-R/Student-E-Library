import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyEdgeToken } from '@/lib/edge-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const user = token ? await verifyEdgeToken(token) : null;

  // Protect Shelf and Reader routes
  const isShelfRoute = pathname.startsWith('/shelf');
  const isReaderRoute = pathname.includes('/read');

  if (isShelfRoute || isReaderRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== 'admin') {
      const homeUrl = new URL('/books', request.url);
      homeUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(homeUrl);
    }
  }

  // Redirect authenticated users away from Login and Register
  if (pathname === '/login' || pathname === '/register') {
    if (user) {
      const redirectTarget = request.nextUrl.searchParams.get('redirect') || '/books';
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/shelf/:path*',
    '/admin/:path*',
    '/books/:id/read',
    '/login',
    '/register',
  ],
};

