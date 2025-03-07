'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, browserSessionPersistence, setPersistence } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

// Only initialize Firebase on the client side
if (typeof window !== 'undefined') {
  try {
    // Initialize Firebase only if it hasn't been initialized already
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Initialize Authentication
    auth = getAuth(app);
    
    // Set session persistence
    setPersistence(auth, browserSessionPersistence)
      .catch((error) => {
        console.error('Error setting auth persistence:', error);
      });
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
} else {
  // Create dummy objects for SSR
  // @ts-ignore - These are just placeholders for SSR
  app = {} as FirebaseApp;
  // @ts-ignore - These are just placeholders for SSR
  db = {} as Firestore;
  // @ts-ignore - These are just placeholders for SSR
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
  } as Auth;
}

export { app, db, auth }; 