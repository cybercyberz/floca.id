import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin, hasAdminRole, setAdminRole } from '@/lib/server-auth';
import { checkRateLimit, incrementFailedAttempt, setSessionCookie } from '@/lib/server-auth';

// Get admin emails from environment variables or use defaults
const getAdminEmails = () => {
  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  if (adminEmailsEnv) {
    return adminEmailsEnv.split(',').map(email => email.trim());
  }
  // Fallback for development
  return ['admin@admin.net', 'vellamatte@gmail.com', 'gilang@flocaid.com'];
};

const ADMIN_EMAILS = getAdminEmails();

// Initialize Firebase Admin
initializeFirebaseAdmin();
const adminAuth = getAuth();

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(ip);
    if (rateLimitCheck.limited === true) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Too many login attempts. Please try again in ${rateLimitCheck.timeRemaining || 15} minutes.` 
        },
        { status: 429 }
      );
    }
    
    // Get credentials from request body
    const { email, password } = await request.json();
    
    if (!email || !password) {
      await incrementFailedAttempt(ip);
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await incrementFailedAttempt(ip);
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    try {
      console.log(`Attempting to sign in user: ${email}`);
      
      // Check if the email is in the admin list
      const isAdminEmail = ADMIN_EMAILS.includes(email);
      if (!isAdminEmail) {
        console.error('Attempted login with non-admin email:', email);
        await incrementFailedAttempt(ip);
        return NextResponse.json(
          { success: false, error: 'This email is not authorized for admin access' },
          { status: 403 }
        );
      }
      
      // Use Firebase Auth REST API to sign in with email and password
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        console.error('Firebase API key is not defined');
        return NextResponse.json(
          { success: false, error: 'Server configuration error' },
          { status: 500 }
        );
      }
      
      // First, sign in with email and password to get the ID token
      const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
      
      console.log('Making request to Firebase Auth REST API');
      const signInResponse = await fetch(signInUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });
      
      const signInData = await signInResponse.json();
      
      if (!signInResponse.ok) {
        console.error('Firebase Auth REST API error:', signInData.error);
        await incrementFailedAttempt(ip);
        
        // Handle specific error codes
        if (signInData.error?.message === 'INVALID_LOGIN_CREDENTIALS') {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Invalid email or password. Make sure the user exists in Firebase Authentication.',
              code: 'INVALID_LOGIN_CREDENTIALS'
            },
            { status: 401 }
          );
        }
        
        return NextResponse.json(
          { success: false, error: signInData.error?.message || 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      console.log('User authenticated successfully with Firebase Auth REST API');
      
      // Get the ID token and user ID from the response
      const idToken = signInData.idToken;
      const userId = signInData.localId;
      
      if (!idToken) {
        console.error('ID token is missing from Firebase Auth response');
        return NextResponse.json(
          { success: false, error: 'Authentication error' },
          { status: 401 }
        );
      }
      
      console.log('User ID from Firebase Auth:', userId);
      
      // Set the session cookie first
      console.log('Setting session cookie');
      const { success, error } = await setSessionCookie(idToken, true);
      
      if (!success) {
        console.error('Failed to set session cookie:', error);
        await incrementFailedAttempt(ip);
        return NextResponse.json(
          { success: false, error: error || 'Failed to create session' },
          { status: 401 }
        );
      }
      
      console.log('Session cookie set successfully');
      
      // Try to get user info, but don't fail if we can't
      let userDisplayName = email.split('@')[0];
      let isAdmin = false;
      
      try {
        // Check if the user has admin role
        const adminRoleResult = await hasAdminRole(userId);
        isAdmin = adminRoleResult.isAdmin;
        
        if (adminRoleResult.user) {
          userDisplayName = adminRoleResult.user.displayName || userDisplayName;
        }
        
        // If the user doesn't have admin role but is in the admin email list, set admin role
        if (!isAdmin && isAdminEmail) {
          console.log('User does not have admin role, setting admin role...');
          await setAdminRole(userId);
          isAdmin = true;
        }
      } catch (userInfoError) {
        console.error('Error getting user info:', userInfoError);
        // Continue anyway, we have the basic info
      }
      
      console.log('Login successful');
      return NextResponse.json({
        success: true,
        user: {
          uid: userId,
          email: email,
          displayName: userDisplayName,
          admin: isAdmin || isAdminEmail, // Ensure admin is true for whitelisted emails
        },
        idToken,
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      await incrementFailedAttempt(ip);
      
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 