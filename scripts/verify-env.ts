import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const requiredEnvVars = {
  // Firebase Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY: 'Firebase API Key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'Firebase Auth Domain',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'Firebase Project ID',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'Firebase Storage Bucket',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'Firebase Messaging Sender ID',
  NEXT_PUBLIC_FIREBASE_APP_ID: 'Firebase App ID',
  
  // TinyMCE Configuration
  NEXT_PUBLIC_TINYMCE_API_KEY: 'TinyMCE API Key',
  
  // Cloudinary Configuration
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'Cloudinary Cloud Name',
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: 'Cloudinary Upload Preset',
  
  // Firebase Admin
  FIREBASE_ADMIN_EMAIL: 'Firebase Admin Email',
  FIREBASE_ADMIN_PASSWORD: 'Firebase Admin Password'
};

const missingVars: string[] = [];
const emptyVars: string[] = [];

// Check for missing or empty environment variables
Object.entries(requiredEnvVars).forEach(([key, description]) => {
  if (!(key in process.env)) {
    missingVars.push(`${key} (${description})`);
  } else if (!process.env[key]) {
    emptyVars.push(`${key} (${description})`);
  }
});

// Print results
console.log('\nEnvironment Variables Verification\n');

if (missingVars.length === 0 && emptyVars.length === 0) {
  console.log('✅ All required environment variables are set!\n');
} else {
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(v => console.log(`   - ${v}`));
    console.log();
  }
  
  if (emptyVars.length > 0) {
    console.log('⚠️  Empty environment variables:');
    emptyVars.forEach(v => console.log(`   - ${v}`));
    console.log();
  }
  
  process.exit(1);
}

// Verify Firebase configuration format
const firebaseConfigValid = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes('AIza') &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.includes('.firebaseapp.com') &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.includes(':');

if (!firebaseConfigValid) {
  console.log('⚠️  Warning: Some Firebase configuration values may be invalid:');
  console.log('   - API Key should start with "AIza"');
  console.log('   - Auth Domain should end with ".firebaseapp.com"');
  console.log('   - App ID should contain ":"');
  console.log();
}

// Verify Cloudinary configuration
const cloudinaryConfigValid =
  !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.includes('your_') &&
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.includes('your_');

if (!cloudinaryConfigValid) {
  console.log('⚠️  Warning: Cloudinary configuration appears to be using placeholder values');
  console.log();
}

console.log('Remember to verify these variables in your Vercel dashboard as well!\n'); 