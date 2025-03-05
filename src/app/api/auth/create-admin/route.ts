import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create user with Firebase Admin SDK
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: true,
    });

    // Set custom claims for admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true
    });

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        role: 'admin'
      }
    });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    );
  }
} 