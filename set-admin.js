/**
 * This script sets admin privileges for an existing user.
 * Run it with: node set-admin.js
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  try {
    // Create a credential object directly
    const credential = {
      type: 'service_account',
      project_id: 'skilled-torus-452322-i5',
      private_key_id: '9dc094570ca6c85b7171e72882becb17aeed9fda',
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdVuDDNEJIG0QN\nwldmGg6Tut1IUFl95uOaBzXh9uhmmzKaQpdO1Grl7paNFqzg4uJofhYx1rrW8Oxg\nX5W/bTaO15/j0lDAx/ydn39vc0yeG41RdNb/cCJWVWSAAIb7jcGHIJWAAHjJ/bsI\nZ4VFU7ixIbC4VAxvrxxOvIXMv8XUjawGXL0KX5j0CQwCvM3pVpGhjaic4zjgiZ4E\n5hN5njxT9BlzjTaGoMzXtTBOdcr6+oMyVG/uZl5hmz4KWxlJ1HWVvlEOGqKyv4ng\nPpStDoF1YEzczw5uuI74gAag7q2px0/oJzE5iPY8d45YulvCb4FUQOpzsWqw6iBG\nFSdCVgs/AgMBAAECggEAIGjCYIM1ufufz4O+FAJ/CTAfH6OpY3U5YcNldnexFF2Y\nlUztNOgtYtJ8AXDvyF0DzQlX0glMsDStRAa8ZlN9Pvwsa7WpO6SWJPOzQMZLvG+p\ncuNx2+kBsa3iRzmUlGF1QTvVf6nZN6ZDre4A9jBSJW5uo/FwJFs6Jf/QQcYo3mjD\nk84Hhl/Rqx8AHUVNdjZuRfgFX+meEzKBtpQrA2Xgaa55G9jVETdsKRna3N2hNULj\nEMXpWdGihLJqLb6nnKNQ8WYCrTWz1AoOsM4PIwFoL2TDOqpojg6JXFbXpqD8zp4u\nTH+urF4nCO6hf6WeVoiZIGJvtHMUGFduEGtJSFmzDQKBgQDO6YJWrFZyAFS12evz\n4O9uBd3oFFRwela4TbgRRi3/RMAtFIh5LeTUY2eHjMU4W+rxGcOpcgzBfRinaYTP\nPccU+mhMnwXVhVnI2g3Y0yMpzVgJq+1kqdwMk1hr0w3Pn4om+67P71Q55BfHLbkK\n2GqM7laWeu9Oxxkn8JBcd3UHwwKBgQDCqqR2ATO7+DbvUuXUoL1z1fmqet26kZh6\nV3Z+1p9zv97YyP0UdvtDm1vV0c8aU8+qmnxsyu+NWubLdUCS5mHeUoQzr+uaKRXd\nfcLSTZGCBmV+uCC0JIzffXjE9gMqEqPZhPn0m6/K9IIhykKBAzkomvvlamvLiZDT\nxmSuzxuy1QKBgB1LpH+fEPI9J8FDpIu4Gk5KmFumnTn7qFGZ92jCtfqBgnAfix8V\nJ2QG2v6vKLFNGluemTxhgHrYumfhocMx7QEEX0YR8eKEaeztKq67Xiwp/cAIzqjE\n//nr1sYVcMwnu4i/c8XPDe7QY6l4yM1HTPa9PBc8Oqu9tssX3WiqJTC/AoGACFBf\na8bLXdjRB9GjjTw8OylFW3mZ5LD5MShxICOsdbYZH2seG/Sk8JM/DdfDH526vc+R\nRtg3+PKL7t6YHm4GegdOLCL0TgY5L9eCLZcwgrwhM5NLmkYBWj4ynT7gjbh0FQMv\n5bmMfX+J20WXJ4lqtIhB/99WsT+z1sefXzPrO+0CgYEAwWij/dHLO2TPzSBMYKWC\nP6UJYqUw9kAEO23zaB7hxx2goCAfNA2tbw4oBS+OPqBeSjyNtoNKvS5R5Nkv84Gy\n7PFL5a0bPs9YZNHdrE6QSJfhaA4Fm5AIi1/5vMB+9ed78V9Ir7DL8/3INUZb6+/a\nkeoWq8LuCY4ICp+lPGoZHcY=\n-----END PRIVATE KEY-----\n',
      client_email: 'firebase-adminsdk@skilled-torus-452322-i5.iam.gserviceaccount.com',
      client_id: '110850390783153340901',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40skilled-torus-452322-i5.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com'
    };
    
    // Initialize Firebase Admin
    const app = admin.initializeApp({
      credential: admin.credential.cert(credential),
      projectId: 'skilled-torus-452322-i5',
    });
    
    console.log('Firebase Admin initialized successfully');
    return app;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    process.exit(1);
  }
};

// Set admin privileges for a user
const setAdminPrivileges = async () => {
  try {
    // Initialize Firebase Admin
    const app = initializeFirebaseAdmin();
    const auth = admin.auth();
    
    // User UID to set as admin
    const uid = 'UDDitovxP8Pr8fGkovCDaMz8hhh2';
    
    // Set admin custom claim
    await auth.setCustomUserClaims(uid, { admin: true });
    
    console.log(`User with UID ${uid} has been granted admin privileges`);
    console.log('You can now log in with your credentials at /admin/login');
    
  } catch (error) {
    console.error('Error setting admin privileges:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
setAdminPrivileges(); 