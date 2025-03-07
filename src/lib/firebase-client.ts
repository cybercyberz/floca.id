'use client';

// This is a simplified Firebase client that doesn't rely on the problematic undici module
// It provides the basic functionality needed for authentication

import { useState, useEffect } from 'react';

// Types
export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  getIdToken: () => Promise<string>;
  getIdTokenResult: () => Promise<{ claims: { admin?: boolean } }>;
};

// Error messages for user-friendly display
export const AUTH_ERRORS = {
  'auth/user-not-found': 'Invalid email or password',
  'auth/wrong-password': 'Invalid email or password',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/weak-password': 'Password is not strong enough',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'default': 'An error occurred. Please try again.'
};

// Login with email and password
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    console.log('Attempting to login with:', email);
    
    // Make a request to our API endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      console.error('Login failed:', data.error);
      return { user: null, error: data.error || 'Login failed' };
    }
    
    console.log('Login successful, user data received');
    
    // Check if we need to refresh the token (if claims were updated)
    if (data.claimsUpdated) {
      console.log('Claims updated, refreshing page to get new token');
      // Wait a moment for the claims to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reload the page to get a fresh token
      window.location.reload();
      return { user: null, error: null, refreshing: true };
    }
    
    // Create a user object from the response
    const user: User = {
      uid: data.user.uid,
      email: data.user.email,
      displayName: data.user.displayName,
      getIdToken: async () => data.idToken,
      getIdTokenResult: async () => ({ claims: { admin: data.user.admin } }),
    };
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Login error:', error);
    return { user: null, error: 'An unexpected error occurred. Please try again.' };
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    // Make a request to our API endpoint
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to send password reset email' };
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

// Logout the current user
export const logout = async () => {
  try {
    // Make a request to our API endpoint
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return { success: false, error: 'Failed to log out' };
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to log out' };
  }
};

// Custom hook to get the current authenticated user
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a request to our API endpoint
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          // Create a user object from the response
          const user: User = {
            uid: data.user.uid,
            email: data.user.email,
            displayName: data.user.displayName,
            getIdToken: async () => data.user.idToken || 'mock-token',
            getIdTokenResult: async () => ({ claims: { admin: data.user.admin } }),
          };
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return { user, loading };
}; 