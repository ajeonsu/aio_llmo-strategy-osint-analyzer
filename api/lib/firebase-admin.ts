import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

let adminInitialized = false;

export const initializeFirebaseAdmin = () => {
  if (adminInitialized || getApps().length > 0) {
    return;
  }

  try {
    // Try to load service account from file
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(path.resolve(serviceAccountPath), 'utf8')
      );
      
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else if (
      process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ) {
      // Use environment variables
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn('Firebase Admin credentials not found. Running without Firebase.');
      return;
    }

    adminInitialized = true;
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
};

export const getDb = () => {
  initializeFirebaseAdmin();
  return getFirestore();
};

export const getAuth = () => {
  initializeFirebaseAdmin();
  return getAdminAuth();
};
