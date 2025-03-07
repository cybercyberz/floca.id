'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import admin from 'firebase-admin';
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin if it hasn't been initialized
export const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    try {
      // Use service account credentials from environment variables or JSON file
      let serviceAccount;
      try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          console.log('Using FIREBASE_SERVICE_ACCOUNT_KEY from environment variables');
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
          console.log('Using firebase-admin-key.json file');
          serviceAccount = require('../../firebase-admin-key.json');
        }
        
        // Log service account details (excluding private key)
        console.log('Service account details:', {
          type: serviceAccount.type,
          project_id: serviceAccount.project_id,
          client_email: serviceAccount.client_email,
          private_key_id: serviceAccount.private_key_id ? serviceAccount.private_key_id.substring(0, 5) + '...' : 'undefined',
          private_key: serviceAccount.private_key ? 'present' : 'missing',
        });
      } catch (error) {
        console.error('Error parsing service account:', error);
        // Fallback to hardcoded service account for development
        console.log('Falling back to hardcoded service account');
        serviceAccount = {
          "type": "service_account",
          "project_id": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "skilled-torus-452322-i5",
          "private_key_id": "9dc094570ca6c85b7171e72882becb17aeed9fda",
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdVuDDNEJIG0QN\nwldmGg6Tut1IUFl95uOaBzXh9uhmmzKaQpdO1Grl7paNFqzg4uJofhYx1rrW8Oxg\nX5W/bTaO15/j0lDAx/ydn39vc0yeG41RdNb/cCJWVWSAAIb7jcGHIJWAAHjJ/bsI\nZ4VFU7ixIbC4VAxvrxxOvIXMv8XUjawGXL0KX5j0CQwCvM3pVpGhjaic4zjgiZ4E\n5hN5njxT9BlzjTaGoMzXtTBOdcr6+oMyVG/uZl5hmz4KWxlJ1HWVvlEOGqKyv4ng\nPpStDoF1YEzczw5uuI74gAag7q2px0/oJzE5iPY8d45YulvCb4FUQOpzsWqw6iBG\nFSdCVgs/AgMBAAECggEAIGjCYIM1ufufz4O+FAJ/CTAfH6OpY3U5YcNldnexFF2Y\nlUztNOgtYtJ8AXDvyF0DzQlX0glMsDStRAa8ZlN9Pvwsa7WpO6SWJPOzQMZLvG+p\ncuNx2+kBsa3iRzmUlGF1QTvVf6nZN6ZDre4A9jBSJW5uo/FwJFs6Jf/QQcYo3mjD\nk84Hhl/Rqx8AHUVNdjZuRfgFX+meEzKBtpQrA2Xgaa55G9jVETdsKRna3N2hNULj\nEMXpWdGihLJqLb6nnKNQ8WYCrTWz1AoOsM4PIwFoL2TDOqpojg6JXFbXpqD8zp4u\nTH+urF4nCO6hf6WeVoiZIGJvtHMUGFduEGtJSFmzDQKBgQDO6YJWrFZyAFS12evz\n4O9uBd3oFFRwela4TbgRRi3/RMAtFIh5LeTUY2eHjMU4W+rxGcOpcgzBfRinaYTP\nPccU+mhMnwXVhVnI2g3Y0yMpzVgJq+1kqdwMk1hr0w3Pn4om+67P71Q55BfHLbkK\n2GqM7laWeu9Oxxkn8JBcd3UHwwKBgQDCqqR2ATO7+DbvUuXUoL1z1fmqet26kZh6\nV3Z+1p9zv97YyP0UdvtDm1vV0c8aU8+qmnxsyu+NWubLdUCS5mHeUoQzr+uaKRXd\nfcLSTZGCBmV+uCC0JIzffXjE9gMqEqPZhPn0m6/K9IIhykKBAzkomvvlamvLiZDT\nxmSuzxuy1QKBgB1LpH+fEPI9J8FDpIu4Gk5KmFumnTn7qFGZ92jCtfqBgnAfix8V\nJ2QG2v6vKLFNGluemTxhgHrYumfhocMx7QEEX0YR8eKEaeztKq67Xiwp/cAIzqjE\n//nr1sYVcMwnu4i/c8XPDe7QY6l4yM1HTPa9PBc8Oqu9tssX3WiqJTC/AoGACFBf\na8bLXdjRB9GjjTw8OylFW3mZ5LD5MShxICOsdbYZH2seG/Sk8JM/DdfDH526vc+R\nRtg3+PKL7t6YHm4GegdOLCL0TgY5L9eCLZcwgrwhM5NLmkYBWj4ynT7gjbh0FQMv\n5bmMfX+J20WXJ4lqtIhB/99WsT+z1sefXzPrO+0CgYEAwWij/dHLO2TPzSBMYKWC\nP6UJYqUw9kAEO23zaB7hxx2goCAfNA2tbw4oBS+OPqBeSjyNtoNKvS5R5Nkv84Gy\n7PFL5a0bPs9YZNHdrE6QSJfhaA4Fm5AIi1/5vMB+9ed78V9Ir7DL8/3INUZb6+/a\nkeoWq8LuCY4ICp+lPGoZHcY=\n-----END PRIVATE KEY-----\n",
          "client_email": "firebase-adminsdk@skilled-torus-452322-i5.iam.gserviceaccount.com",
          "client_id": "110850390783153340901",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40skilled-torus-452322-i5.iam.gserviceaccount.com",
          "universe_domain": "googleapis.com"
        };
      }
      
      // Ensure the private key is properly formatted
      if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      
      console.log('Initializing Firebase Admin with project ID:', serviceAccount.project_id);
      
      initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
      
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  } else {
    console.log('Firebase Admin already initialized');
  }
  
  return getApp();
};

// Initialize Firebase Admin
const app = initializeFirebaseAdmin();
const adminAuth = getAuth(app);

// Check if a user exists in Firebase (without creating it)
export async function checkUserExists(uid: string) {
  try {
    console.log(`Checking if user exists in Firebase: ${uid}`);
    
    try {
      // Try to get the user
      const userRecord = await adminAuth.getUser(uid);
      console.log('User exists in Firebase:', userRecord.uid);
      
      // Check if user has admin role
      const customClaims = userRecord.customClaims || {};
      const isAdmin = customClaims.admin === true;
      
      return { exists: true, user: userRecord, isAdmin };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.error(`User ${uid} not found in Firebase`);
        return { exists: false, error: 'User not found in Firebase' };
      }
      
      console.error('Error checking if user exists:', error);
      return { exists: false, error: `Firebase error: ${error.message || 'Unknown error'}` };
    }
  } catch (error) {
    console.error('Error in checkUserExists:', error);
    return { exists: false, error: 'Internal server error' };
  }
}

// Set session cookie
export async function setSessionCookie(idToken: string, requireAdmin: boolean = true) {
  try {
    console.log('Setting session cookie with ID token:', idToken.substring(0, 10) + '...');
    
    // Verify the ID token first
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log('ID token verified successfully for user:', decodedToken.uid);
      
      // Check if the user exists in Firebase
      const { exists, user, isAdmin, error: userError } = await checkUserExists(decodedToken.uid);
      
      if (!exists) {
        console.error('User does not exist in Firebase:', userError);
        return { success: false, error: 'Authentication failed: User does not exist in Firebase' };
      }
      
      if (requireAdmin && !isAdmin) {
        console.error('User does not have admin privileges:', decodedToken.uid);
        return { success: false, error: 'Authentication failed: You do not have admin privileges' };
      }
      
      if (user) {
        console.log('User confirmed in Firebase:', user.uid, 'Admin:', isAdmin);
      }
    } catch (verifyError) {
      console.error('Error verifying ID token:', verifyError);
      return { success: false, error: 'Authentication failed: Invalid ID token' };
    }
    
    // Create session cookie with expiration (default: 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    
    try {
      // Convert expiresIn to seconds for createSessionCookie
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: expiresIn / 1000 });
      console.log('Session cookie created successfully, length:', sessionCookie.length);
      
      // Generate CSRF token
      const csrfToken = generateCSRFToken();
      
      // Set the session cookie
      cookies().set({
        name: 'session',
        value: sessionCookie,
        maxAge: expiresIn / 1000, // Convert to seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
      
      // Set CSRF token cookie (accessible to JavaScript)
      cookies().set({
        name: 'csrf_token',
        value: csrfToken,
        maxAge: expiresIn / 1000,
        httpOnly: false, // Accessible to JavaScript
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
      
      return { success: true, csrfToken };
    } catch (cookieError) {
      console.error('Error creating session cookie:', cookieError);
      return { success: false, error: 'Authentication failed: Unable to create session' };
    }
  } catch (error) {
    console.error('Error in setSessionCookie:', error);
    return { success: false, error: 'Authentication failed: Internal server error' };
  }
}

// Generate a random CSRF token
function generateCSRFToken() {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
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
    const isAdmin = customClaims.admin === true;
    
    if (!isAdmin) {
      console.error('User does not have admin privileges:', user.uid);
      return { user: null, error: 'User does not have admin privileges' };
    }
    
    console.log('Session verified for admin user:', user.uid);
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
    console.log(`Setting admin role for user: ${uid}`);
    
    // Add custom claims for admin privileges
    await adminAuth.setCustomUserClaims(uid, { admin: true });
    
    console.log(`Admin role set successfully for user: ${uid}`);
    return { success: true };
  } catch (error) {
    console.error('Error setting admin role:', error);
    return { success: false, error };
  }
}

// Create a new admin user
export async function createAdminUser(email: string, password: string, displayName: string) {
  try {
    console.log(`Creating admin user with email: ${email}`);
    
    // Check if the user already exists
    try {
      const existingUser = await adminAuth.getUserByEmail(email);
      console.log(`User with email ${email} already exists with UID: ${existingUser.uid}`);
      
      // Set admin role for the existing user
      await setAdminRole(existingUser.uid);
      
      return { user: existingUser, error: null };
    } catch (error: any) {
      // If the user doesn't exist, create a new one
      if (error.code === 'auth/user-not-found') {
        // Create the user
        const userRecord = await adminAuth.createUser({
          email,
          password,
          displayName,
          emailVerified: true,
        });
        
        console.log(`User created successfully with UID: ${userRecord.uid}`);
        
        // Set admin role for the new user
        await setAdminRole(userRecord.uid);
        
        return { user: userRecord, error: null };
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return { user: null, error: error.message || 'Failed to create admin user' };
  }
}

// Check if a user has admin role
export async function hasAdminRole(uid: string) {
  try {
    console.log(`Checking admin role for user: ${uid}`);
    
    // Get the user record
    const userRecord = await adminAuth.getUser(uid);
    
    // Check if the user has admin custom claim
    const customClaims = userRecord.customClaims || {};
    const isAdmin = customClaims.admin === true;
    
    console.log(`User ${uid} admin status: ${isAdmin}`);
    return { isAdmin, user: userRecord };
  } catch (error) {
    console.error('Error checking admin role:', error);
    return { isAdmin: false, error };
  }
}

// Verify CSRF token
export async function verifyCSRFToken(request: Request) {
  try {
    // Get the CSRF token from the cookie
    const csrfCookie = cookies().get('csrf_token')?.value;
    
    // Get the CSRF token from the request header
    const csrfHeader = request.headers.get('X-CSRF-Token');
    
    if (!csrfCookie || !csrfHeader) {
      console.error('CSRF token missing from cookie or header');
      return { valid: false, error: 'CSRF token missing' };
    }
    
    // Compare the tokens
    if (csrfCookie !== csrfHeader) {
      console.error('CSRF token mismatch');
      return { valid: false, error: 'CSRF token invalid' };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error verifying CSRF token:', error);
    return { valid: false, error: 'Error verifying CSRF token' };
  }
} 