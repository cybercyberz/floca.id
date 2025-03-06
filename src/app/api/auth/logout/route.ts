import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/server-auth';

export async function POST() {
  try {
    // Clear the session cookie
    await clearSessionCookie();
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to log out' },
      { status: 500 }
    );
  }
} 