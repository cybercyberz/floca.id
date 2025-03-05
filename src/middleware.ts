import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/firebase';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login';
  
  // Get Firebase ID token from Authorization header
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicPath && token) {
    try {
      // Verify token with Firebase Admin SDK
      const user = auth.currentUser;
      if (user) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch (error) {
      // Token is invalid, continue to login page
      console.error('Token verification error:', error);
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ]
}; 