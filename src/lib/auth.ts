'use client';

import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import { useState, useEffect } from 'react';

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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Login error:', error);
    const errorCode = error.code || 'default';
    const errorMessage = AUTH_ERRORS[errorCode as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default;
    return { user: null, error: errorMessage };
  }
};

// Create a new admin user (should be used only by authorized admins)
export const createAdminUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Create user error:', error);
    const errorCode = error.code || 'default';
    const errorMessage = AUTH_ERRORS[errorCode as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default;
    return { user: null, error: errorMessage };
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Password reset error:', error);
    const errorCode = error.code || 'default';
    const errorMessage = AUTH_ERRORS[errorCode as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default;
    return { success: false, error: errorMessage };
  }
};

// Logout the current user
export const logout = async () => {
  try {
    await signOut(auth);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

// Check if user is authenticated (for client components)
export const isAuthenticated = () => {
  return auth.currentUser !== null;
}; 