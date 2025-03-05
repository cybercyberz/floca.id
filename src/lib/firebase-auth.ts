'use client';

import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idTokenResult = await userCredential.user.getIdTokenResult();
    
    // Check if user has admin claim
    const isAdmin = idTokenResult.claims.admin === true;
    
    if (!isAdmin) {
      await signOut(auth);
      return null;
    }

    return {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      role: 'ADMIN'
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return null;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

// Helper to check if user is authenticated and is an admin
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const isAdmin = idTokenResult.claims.admin === true;
          resolve(isAdmin ? user : null);
        } catch (error) {
          console.error('Error checking admin status:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, reject);
  });
}

// Helper to get the current auth token
export async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
} 