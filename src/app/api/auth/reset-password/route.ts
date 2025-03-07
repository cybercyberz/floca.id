import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/server-auth';

// Initialize Firebase Admin
initializeFirebaseAdmin();
const adminAuth = getAuth();

export async function POST(request: NextRequest) {
  try {
    // Get email from request body
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    try {
      // Generate password reset link
      const link = await adminAuth.generatePasswordResetLink(email);
      
      // In a real application, you would send this link via email
      console.log('Password reset link:', link);
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Return appropriate error message
      if (error.code === 'auth/user-not-found') {
        // Don't reveal that the user doesn't exist for security reasons
        return NextResponse.json(
          { success: true, message: 'If an account exists with this email, a password reset link has been sent' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Reset password API error:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 