/**
 * This script creates an admin user in Firebase Authentication.
 * Run it with: node create-admin-user.js
 */

const admin = require('firebase-admin');

// Admin user credentials
const ADMIN_USERS = [
  {
    email: 'vellamatte@gmail.com',
    password: 'wew321321',
    displayName: 'Admin User'
  },
  {
    email: 'gilang@flocaid.com',
    password: 'lah321321',
    displayName: 'Gilang Admin'
  }
];

// Use the local service account file
const serviceAccount = require('./firebase-admin-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

async function setupAdminUser(userData) {
  try {
    // Check if the user already exists
    try {
      const userRecord = await admin.auth().getUserByEmail(userData.email);
      console.log(`User with email ${userData.email} already exists with UID: ${userRecord.uid}`);
      
      // Set admin custom claim
      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
      console.log(`Admin role set for user: ${userRecord.uid}`);
      
      return userRecord;
    } catch (error) {
      // If user doesn't exist, create a new one
      if (error.code === 'auth/user-not-found') {
        console.log(`Creating new user with email: ${userData.email}`);
        
        // Create the user
        const userRecord = await admin.auth().createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: true,
        });
        
        console.log(`User created successfully with UID: ${userRecord.uid}`);
        
        // Set admin custom claim
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
        console.log(`Admin role set for user: ${userRecord.uid}`);
        
        return userRecord;
      }
      
      throw error;
    }
  } catch (error) {
    console.error(`Error setting up admin user ${userData.email}:`, error);
    return null;
  }
}

// Process all admin users
async function setupAllAdminUsers() {
  console.log(`Setting up ${ADMIN_USERS.length} admin users...`);
  
  const results = [];
  for (const userData of ADMIN_USERS) {
    try {
      const result = await setupAdminUser(userData);
      if (result) {
        results.push({
          email: userData.email,
          uid: result.uid,
          success: true
        });
      } else {
        results.push({
          email: userData.email,
          success: false
        });
      }
    } catch (error) {
      console.error(`Failed to process user ${userData.email}:`, error);
      results.push({
        email: userData.email,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Run the script
setupAllAdminUsers()
  .then(results => {
    console.log('Admin users setup complete!');
    console.log('Results:', results);
    
    // Check if any users failed
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      console.error(`Failed to set up ${failures.length} users`);
      process.exit(1);
    } else {
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('Failed to set up admin users:', error);
    process.exit(1);
  }); 