const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'UDDitovxP8Pr8fGkovCDaMz8hhh2'; // Your user's UID

admin.auth().getUser(uid)
  .then((userRecord) => {
    console.log(`Successfully fetched user data: ${userRecord.toJSON().email}`);
    
    // Set admin custom claim
    return admin.auth().setCustomUserClaims(uid, { admin: true });
  })
  .then(() => {
    console.log(`Successfully set admin claim for user with UID: ${uid}`);
    console.log('You can now log in with your credentials at /admin/login');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting admin claim:', error);
    process.exit(1);
  }); 