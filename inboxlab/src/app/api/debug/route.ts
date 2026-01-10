import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔍 Debug API called');
  
  return NextResponse.json({
    status: 'API server is running',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasFirebaseClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasFirebasePrivateKey: !!process.env.FIREBASE_PRIVATE_KEY ? 'Yes (hidden)' : 'No',
    note: 'Check server terminal for detailed logs'
  });
}