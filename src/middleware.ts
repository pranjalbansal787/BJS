import { NextResponse, type NextRequest } from 'next/server';

/**
 * Gate the admin portal at the edge. The cookie signature is verified again in
 * `requireSession()` before any write, so this is a redirect, not the check.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }
  if (!request.cookies.get('bjs_admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
