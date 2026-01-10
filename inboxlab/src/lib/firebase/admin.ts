import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore, CollectionReference, DocumentReference, Query } from 'firebase-admin/firestore';

// Initialize variables
let adminApp: App | null = null;
let adminAuthInstance: Auth | null = null;
let adminDbInstance: Firestore | null = null;

// Initialize function
function initializeFirebaseAdmin() {
  try {
    // Check if already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      adminApp = existingApps[0];
      adminAuthInstance = getAuth(adminApp);
      adminDbInstance = getFirestore(adminApp);
      console.log('✅ Firebase Admin already initialized');
      return;
    }

    // Check for required environment variables
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_PRIVATE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn('⚠️ Missing Firebase Admin environment variables:', missingVars);
      console.warn('API routes will use mock data until configured');
      return;
    }

    // Clean and validate private key
    const privateKey = process.env.FIREBASE_PRIVATE_KEY!;
    let cleanedPrivateKey = privateKey;
    
    // Handle different formats
    if (privateKey.includes('\\n')) {
      cleanedPrivateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // Remove surrounding quotes if present
    if ((cleanedPrivateKey.startsWith('"') && cleanedPrivateKey.endsWith('"')) ||
        (cleanedPrivateKey.startsWith("'") && cleanedPrivateKey.endsWith("'"))) {
      cleanedPrivateKey = cleanedPrivateKey.slice(1, -1);
    }
    
    // Validate key format
    if (!cleanedPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      console.error('❌ Firebase private key appears malformed');
      console.error('Key should start with: -----BEGIN PRIVATE KEY-----');
      return;
    }

    // Initialize Firebase Admin
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: cleanedPrivateKey,
      }),
    });

    adminAuthInstance = getAuth(adminApp);
    adminDbInstance = getFirestore(adminApp);
    
    console.log('✅ Firebase Admin initialized successfully');
    console.log(`📁 Project: ${process.env.FIREBASE_PROJECT_ID}`);

  } catch (error: any) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    console.error('Error details:', {
      code: error.code,
      stack: error.stack?.split('\n')[0]
    });
  }
}

// Initialize on import
initializeFirebaseAdmin();

// SIMPLIFIED VERSION - Just return null if not initialized
export const adminAuth = {
  verifyIdToken: (token: string) => {
    if (!adminAuthInstance) {
      console.warn('⚠️ Firebase Admin Auth not initialized');
      return Promise.reject(new Error('Firebase Admin not configured'));
    }
    return adminAuthInstance.verifyIdToken(token);
  },
};

export const adminDb = {
  collection: (path: string) => {
    if (!adminDbInstance) {
      console.warn('⚠️ Firebase Admin Firestore not initialized');
      // Return a minimal mock that won't crash
      return {
        doc: () => ({
          id: 'mock-id',
          set: () => Promise.resolve(),
          get: () => Promise.resolve({ exists: false, data: () => null }),
          update: () => Promise.resolve(),
          delete: () => Promise.resolve(),
        }),
        where: () => ({
          get: () => Promise.resolve({ empty: true, docs: [] }),
        }),
        orderBy: () => ({
          limit: () => ({
            get: () => Promise.resolve({ empty: true, docs: [] }),
          }),
          get: () => Promise.resolve({ empty: true, docs: [] }),
        }),
        limit: () => ({
          get: () => Promise.resolve({ empty: true, docs: [] }),
        }),
        get: () => Promise.resolve({ empty: true, docs: [] }),
      } as any; // Use 'any' to simplify
    }
    return adminDbInstance.collection(path);
  },
};