/**
 * This script creates the first admin user for the application.
 * Run it with: npx ts-node -r dotenv/config src/scripts/create-admin.ts
 */

import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  try {
    // Get service account path from environment or use default
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
      path.resolve(process.cwd(), 'firebase-admin-key.json');
    
    // Check if service account file exists
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account file not found at: ${serviceAccountPath}`);
    }
    
    // Read service account file
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    // Initialize Firebase Admin
    const app = initializeApp({
      credential: require('firebase-admin').credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    
    console.log('Firebase Admin initialized successfully');
    return app;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Initialize Firebase Admin
    const app = initializeFirebaseAdmin();
    const auth = getAuth(app);
    
    // Prompt for admin user details
    const email = await prompt('Enter admin email: ');
    const password = await prompt('Enter admin password (min 6 characters): ');
    const displayName = await prompt('Enter admin display name: ');
    
    // Validate inputs
    if (!email || !password || !displayName) {
      console.error('All fields are required');
      process.exit(1);
    }
    
    // Create user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });
    
    // Set custom claims to mark as admin
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    
    console.log(`Admin user created successfully with UID: ${userRecord.uid}`);
    console.log('You can now log in with these credentials at /admin/login');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
};

// Run the script
createAdminUser(); 