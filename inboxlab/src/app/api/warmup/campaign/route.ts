import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  console.log('🎯 Campaign API POST called');
  
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.domain || !body.sendingEmail || !body.dailyEmails || !body.duration) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        received: { 
          domain: body.domain, 
          sendingEmail: body.sendingEmail, 
          dailyEmails: body.dailyEmails, 
          duration: body.duration 
        }
      }, { status: 400 });
    }
    
    // For now, always use mock mode
    const mockCampaign = {
      id: 'mock-' + Date.now(),
      userId: 'mock-user-id',
      domain: body.domain,
      sendingEmail: body.sendingEmail,
      dailyEmails: parseInt(body.dailyEmails),
      duration: parseInt(body.duration),
      currentDay: 1,
      totalEmailsSent: 0,
      totalEmailsToSend: parseInt(body.dailyEmails) * parseInt(body.duration),
      status: 'active' as const,
      inboxRate: 0,
      bounceRate: 0,
      openRate: 0,
      spamComplaints: 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + parseInt(body.duration) * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('✅ Created mock campaign:', mockCampaign.id);
    
    return NextResponse.json({
      success: true,
      campaignId: mockCampaign.id,
      message: 'Mock campaign created successfully',
      campaign: mockCampaign,
      note: 'Working with mock data. Real Firebase coming soon.',
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.name
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Always return mock data for now
    const mockCampaigns = [
      {
        id: 'mock-1',
        userId: 'mock-user',
        domain: 'test-domain.com',
        sendingEmail: 'test@example.com',
        dailyEmails: 20,
        duration: 30,
        currentDay: 5,
        totalEmailsSent: 100,
        totalEmailsToSend: 600,
        status: 'active' as const,
        inboxRate: 95,
        bounceRate: 0.5,
        openRate: 45,
        spamComplaints: 0,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mock-2',
        userId: 'mock-user',
        domain: 'another-domain.com',
        sendingEmail: 'sender@another.com',
        dailyEmails: 30,
        duration: 45,
        currentDay: 15,
        totalEmailsSent: 450,
        totalEmailsToSend: 1350,
        status: 'completed' as const,
        inboxRate: 97,
        bounceRate: 0.2,
        openRate: 52,
        spamComplaints: 0,
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    return NextResponse.json({ campaigns: mockCampaigns });
    
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ campaigns: [] }, { status: 200 });
  }
}