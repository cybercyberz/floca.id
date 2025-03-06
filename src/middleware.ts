import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Define the paths that should be protected
const PROTECTED_PATHS = [
  '/admin',
  '/admin/articles',
  '/admin/articles/new',
];

// Define the login path
const LOGIN_PATH = '/admin/login';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // If it's not a protected path, allow the request
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // If it's the login page, allow the request
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }
  
  // Check for the session token in cookies
  const sessionCookie = request.cookies.get('session');
  
  // If there's no session cookie, redirect to login
  if (!sessionCookie) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

// Configure the middleware to run only for admin routes
export const config = {
  matcher: ['/admin/:path*'],
}; 