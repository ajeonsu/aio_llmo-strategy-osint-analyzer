import { NextRequest } from 'next/server';
import { initializeFirebaseAdmin, getAuth } from './firebase-admin';

export async function verifyAuthToken(request: NextRequest): Promise<{ uid: string; email: string } | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    
    initializeFirebaseAdmin();
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function unauthorizedResponse() {
  return Response.json(
    { success: false, error: 'Unauthorized. Please sign in.' },
    { status: 401 }
  );
}
