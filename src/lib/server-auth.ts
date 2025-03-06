'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Mock implementation for demo purposes
// In a real application, this would use Firebase Admin SDK

// Set session cookie
export async function setSessionCookie(idToken: string) {
  try {
    // For demo purposes, we'll just set a simple cookie
    cookies().set({
      name: 'session',
      value: idToken,
      maxAge: 60 * 60 * 24 * 14, // 14 days
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
    
    // For demo purposes, we'll just return a mock user
    const user = {
      uid: '123456',
      email: 'admin@example.com',
      displayName: 'Admin User',
    };
    
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