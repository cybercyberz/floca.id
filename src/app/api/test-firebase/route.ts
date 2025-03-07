import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/server-auth';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
initializeFirebaseAdmin();
const adminAuth = getAuth();

export async function GET(request: NextRequest) {
  try {
    // Try to list users (limited to 1) to test Firebase Admin SDK
    const listUsersResult = await adminAuth.listUsers(1);
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Admin SDK is working correctly',
      userCount: listUsersResult.users.length,
      serviceAccountEmail: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY).client_email : 
        'Using fallback service account'
    });
  } catch (error: any) {
    console.error('Firebase test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      serviceAccountInfo: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 
        'Environment variable exists' : 
        'Environment variable missing'
    }, { status: 500 });
  }
} 