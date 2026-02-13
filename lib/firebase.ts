import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCOoTF6k3rSQR6xkbzAaGY-6q6E0T8FaqU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aio-llmo-analyzer.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aio-llmo-analyzer",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aio-llmo-analyzer.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102712996564972471906",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102712996564972471906:web:abcdef"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
