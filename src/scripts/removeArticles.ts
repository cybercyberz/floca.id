import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function removeArticles() {
  try {
    // First authenticate
    await signInWithEmailAndPassword(auth, process.env.FIREBASE_ADMIN_EMAIL || '', process.env.FIREBASE_ADMIN_PASSWORD || '');
    console.log('Successfully authenticated');

    const articlesToRemove = [
      '1740892288015',
      '1740892724151'
    ];

    // First, try to verify if the articles exist
    const articlesRef = collection(db, 'articles');
    const snapshot = await getDocs(articlesRef);
    
    console.log('\nFound articles:');
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data().title);
    });

    // Then attempt to delete them
    console.log('\nAttempting to delete articles...');
    for (const articleId of articlesToRemove) {
      try {
        const docRef = doc(db, 'articles', articleId);
        await deleteDoc(docRef);
        console.log(`Successfully deleted article ${articleId}`);
      } catch (error) {
        console.error(`Error deleting article ${articleId}:`, error);
      }
    }
    
    console.log('\nDeletion process completed');
  } catch (error) {
    console.error('Error in removeArticles:', error);
  }
}

// Execute the function
removeArticles()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 