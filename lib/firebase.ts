import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDZhpCypvu-Jqpne8Fr_kfmRz36r9Ik_Ys",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aio-llmo-analyzer.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aio-llmo-analyzer",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aio-llmo-analyzer.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "672681578580",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:672681578580:web:6161a53e37e0f529489dc1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8EH333VkXM"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Set auth persistence to LOCAL (stays logged in even after closing browser)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});

export const googleProvider = new GoogleAuthProvider();

export default app;
