import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    // First check for redirect result, then set up the listener
    const initAuth = async () => {
      console.log('🔍 Initializing auth...');
      try {
        // Wait for redirect result first
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('✅ Redirect sign-in successful!');
          console.log('   User:', result.user.email);
          console.log('   UID:', result.user.uid);
        } else {
          console.log('ℹ️ No redirect result (normal page load)');
        }
      } catch (error: any) {
        console.error('❌ Redirect sign-in error:', error.code, error.message);
      }

      // AFTER checking redirect, set up auth state listener
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('🔄 Auth state: LOGGED IN');
          console.log('   Email:', user.email);
          console.log('   UID:', user.uid);
        } else {
          console.log('🔄 Auth state: NOT LOGGED IN');
        }
        setUser(user);
        setLoading(false);
      });
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (!user) return null;
    return await user.getIdToken();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
