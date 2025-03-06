import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie, verifySessionCookie, checkRateLimit, incrementFailedAttempt } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(ip);
    if (rateLimitCheck.limited) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Too many login attempts. Please try again in ${rateLimitCheck.timeRemaining} minutes.` 
        },
        { status: 429 }
      );
    }
    
    // Get the ID token from the request body
    const { idToken } = await request.json();
    
    if (!idToken) {
      incrementFailedAttempt(ip);
      return NextResponse.json(
        { success: false, error: 'ID token is required' },
        { status: 400 }
      );
    }
    
    // Set the session cookie
    const { success, error } = await setSessionCookie(idToken);
    
    if (!success) {
      incrementFailedAttempt(ip);
      return NextResponse.json(
        { success: false, error: error || 'Failed to create session' },
        { status: 401 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verify the session cookie
    const { user, error } = await verifySessionCookie();
    
    if (error || !user) {
      return NextResponse.json(
        { authenticated: false, error: error || 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Return user information
    return NextResponse.json({
      authenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }
    });
  } catch (error) {
    console.error('Session verification error:', error);
    
    // Return error response
    return NextResponse.json(
      { authenticated: false, error: 'Failed to verify session' },
      { status: 500 }
    );
  }
} 