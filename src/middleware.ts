import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Must match the secret in login route

// Paths that require authentication
const protectedPaths = ['/admin', '/admin/articles'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is protected
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      // Redirect to login if no token is present
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the token
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure matcher for middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
} 