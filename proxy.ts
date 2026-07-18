import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('insforge-token')?.value;
  const { pathname } = request.nextUrl;

  let isExpired = true;
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        // Decode the payload of the JWT
        const payload = JSON.parse(atob(parts[1]));
        const exp = payload.exp;
        if (exp) {
          isExpired = Date.now() >= exp * 1000;
        } else {
          isExpired = false;
        }
      }
    } catch {
      isExpired = true;
    }
  }

  const isAuthenticated = token && !isExpired;

  // Protect /dashboard and all its subroutes
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Redirect authenticated users trying to access login/signup back to dashboard
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    if (isAuthenticated) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};
