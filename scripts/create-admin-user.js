const admin = require('firebase-admin');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Check if service account file exists
const serviceAccountPath = path.join(__dirname, '..', 'firebase-admin-key.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: firebase-admin-key.json not found in project root');
  process.exit(1);
}

// Load and validate service account
let serviceAccount;
try {
  serviceAccount = require('../firebase-admin-key.json');
  
  // Validate required fields
  const requiredFields = ['project_id', 'private_key', 'client_email'];
  const missingFields = requiredFields.filter(field => !serviceAccount[field]);
  
  if (missingFields.length > 0) {
    console.error('Error: Invalid service account key file. Missing required fields:', missingFields);
    process.exit(1);
  }

  console.log('Service account loaded successfully for project:', serviceAccount.project_id);
} catch (error) {
  console.error('Error loading service account:', error.message);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify the question method
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
  let email;
  try {
    // Get email and password from user input
    email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create the user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      emailVerified: true,
    });

    // Set admin custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true
    });

    console.log('\nSuccessfully created admin user:', {
      uid: userRecord.uid,
      email: userRecord.email
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      // If user exists, try to set admin claim
      try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, {
          admin: true
        });
        console.log('\nSuccessfully set admin claims for existing user:', {
          uid: user.uid,
          email: user.email
        });
      } catch (innerError) {
        console.error('\nError setting admin claims:', innerError.message);
      }
    } else {
      console.error('\nError creating admin user:', error.message);
    }
  } finally {
    rl.close();
  }
}

createAdminUser()
  .catch((error) => {
    console.error('\nScript failed:', error.message);
    process.exit(1);
  }); 