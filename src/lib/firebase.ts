'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase config object
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing required Firebase configuration fields:', missingFields);
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }
};

let app: FirebaseApp;
let db: Firestore;
let analytics: Analytics | null = null;
let auth: any;

try {
  // Validate config before initialization
  validateFirebaseConfig();
  
  // Initialize Firebase only if it hasn't been initialized already
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Analytics conditionally
  if (typeof window !== 'undefined') {
    // Only initialize analytics on the client side
    isSupported().then(yes => yes && getAnalytics(app)).catch(err => {
      console.warn('Failed to initialize analytics:', err);
    });
  }
  
  // Initialize Auth
  auth = getAuth(app);
  
  console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app, db, analytics, auth }; 