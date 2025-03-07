import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number, timestamp: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

// Define the login path
const LOGIN_PATH = '/admin/login';

export function middleware(request: NextRequest) {
  // Handle admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin/') && 
      !request.nextUrl.pathname.startsWith(LOGIN_PATH)) {
    
    // Check for session cookie
    const sessionCookie = request.cookies.get('session');
    
    // If no session cookie, redirect to login
    if (!sessionCookie) {
      const url = new URL(LOGIN_PATH, request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: ['/admin/:path*'],
}; 