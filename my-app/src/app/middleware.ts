import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const protectedPaths = ['/Home', '/profile', '/Add-Recipe'];
  const path = request.nextUrl.pathname;

  if (protectedPaths.includes(path) && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Home/:path*', '/profile/:path*', '/Add-Recipe'],
};
