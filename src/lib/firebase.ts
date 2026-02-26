import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCvYOueHYtbbQm9NYNXQxzRhzOGkSWXDLw",
  authDomain: "lyfind-72845.firebaseapp.com",
  projectId: "lyfind-72845",
  storageBucket: "lyfind-72845.firebasestorage.app",
  messagingSenderId: "153935340746",
  appId: "1:153935340746:web:87ea7489649e48b3894033",
  measurementId: "G-JPED770NSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);

// Set auth persistence to LOCAL (keeps user logged in across browser sessions)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
