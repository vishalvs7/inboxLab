import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin'; // Changed import
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { domain, sendingEmail, dailyEmails, duration } = body;

    // Validation
    if (!domain || !sendingEmail || !dailyEmails || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate dates
    const startDate = Timestamp.now();
    const endDate = Timestamp.fromDate(
      new Date(startDate.toDate().getTime() + duration * 24 * 60 * 60 * 1000)
    );

    // Create campaign
    const campaignRef = adminDb.collection('warmup_campaigns').doc();
    const campaign = {
      id: campaignRef.id,
      userId,
      domain,
      sendingEmail,
      dailyEmails: parseInt(dailyEmails),
      duration: parseInt(duration),
      currentDay: 1,
      totalEmailsSent: 0,
      totalEmailsToSend: dailyEmails * duration,
      status: 'active',
      inboxRate: 0,
      bounceRate: 0,
      openRate: 0,
      spamComplaints: 0,
      startDate,
      endDate,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await campaignRef.set(campaign);

    return NextResponse.json({ 
      success: true, 
      campaignId: campaignRef.id,
      message: 'Campaign created successfully. Note: Email scheduling requires additional setup.'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const snapshot = await adminDb.collection('warmup_campaigns')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const campaigns = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}