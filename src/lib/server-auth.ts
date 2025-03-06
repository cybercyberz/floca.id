'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import admin from 'firebase-admin';
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin if it hasn't been initialized
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    try {
      // Use service account credentials from environment variables or JSON file
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) 
        : require('../../firebase-admin-key.json');
      
      initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }
  
  return getApp();
};

// Initialize Firebase Admin
const app = initializeFirebaseAdmin();
const adminAuth = getAuth(app);

// Set session cookie
export async function setSessionCookie(idToken: string) {
  try {
    // Create session cookie with expiration (default: 14 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days in milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    // Set the cookie
    cookies().set({
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting session cookie:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

// Verify session cookie
export async function verifySessionCookie() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    
    if (!sessionCookie) {
      return { user: null, error: 'No session cookie found' };
    }
    
    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const user = await adminAuth.getUser(decodedClaims.uid);
    
    // Check if user has admin role
    const customClaims = user.customClaims || {};
    if (!customClaims.admin) {
      return { user: null, error: 'User does not have admin privileges' };
    }
    
    return { user, error: null };
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return { user: null, error: 'Invalid session' };
  }
}

// Clear session cookie (logout)
export async function clearSessionCookie() {
  cookies().delete('session');
  return { success: true };
}

// Protect server routes
export async function requireAuth() {
  const { user, error } = await verifySessionCookie();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  return user;
}

// Rate limiting for failed login attempts
const failedLoginAttempts = new Map<string, { count: number, timestamp: number }>();

export async function checkRateLimit(ip: string) {
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  
  const now = Date.now();
  const attempt = failedLoginAttempts.get(ip);
  
  // If no previous attempts or window expired, reset
  if (!attempt || now - attempt.timestamp > WINDOW_MS) {
    failedLoginAttempts.set(ip, { count: 0, timestamp: now });
    return { limited: false, remainingAttempts: MAX_ATTEMPTS };
  }
  
  // Check if rate limited
  if (attempt.count >= MAX_ATTEMPTS) {
    const timeRemaining = Math.ceil((WINDOW_MS - (now - attempt.timestamp)) / 1000 / 60);
    return { 
      limited: true, 
      remainingAttempts: 0,
      timeRemaining
    };
  }
  
  return { 
    limited: false, 
    remainingAttempts: MAX_ATTEMPTS - attempt.count 
  };
}

export async function incrementFailedAttempt(ip: string) {
  const attempt = failedLoginAttempts.get(ip) || { count: 0, timestamp: Date.now() };
  failedLoginAttempts.set(ip, {
    count: attempt.count + 1,
    timestamp: attempt.timestamp
  });
}

// Set admin role for a user
export async function setAdminRole(uid: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, { admin: true });
    return { success: true };
  } catch (error) {
    console.error('Error setting admin role:', error);
    return { success: false, error: 'Failed to set admin role' };
  }
}

// Create a new admin user
export async function createAdminUser(email: string, password: string, displayName: string) {
  try {
    // Create the user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });
    
    // Set admin role
    await setAdminRole(userRecord.uid);
    
    return { user: userRecord, error: null };
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return { user: null, error: error.message || 'Failed to create admin user' };
  }
} 