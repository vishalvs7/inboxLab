import { db } from './config'; // Changed from './config' to import db directly
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';

// Collections reference
export const campaignsCollection = collection(db, 'warmup_campaigns');
export const emailsCollection = collection(db, 'warmup_emails');
export const statsCollection = collection(db, 'warmup_stats');
export const settingsCollection = collection(db, 'user_settings');

// Types (keep your existing types)
export interface WarmupCampaign {
  id: string;
  userId: string;
  domain: string;
  sendingEmail: string;
  dailyEmails: number;
  duration: number;
  currentDay: number;
  totalEmailsSent: number;
  totalEmailsToSend: number;
  status: 'active' | 'paused' | 'completed' | 'failed';
  inboxRate: number;
  bounceRate: number;
  openRate: number;
  spamComplaints: number;
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


export interface WarmupEmail {
  id: string;
  campaignId: string;
  userId: string;
  toEmail: string;
  subject: string;
  content: string;
  status: 'scheduled' | 'sent' | 'failed' | 'bounced';
  scheduledFor: Timestamp;
  sentAt?: Timestamp;
  bounceReason?: string;
  openCount: number;
  createdAt: Timestamp;
}

export interface WarmupStats {
  id: string;
  userId: string;
  campaignId: string;
  date: Timestamp;
  emailsSent: number;
  emailsOpened: number;
  emailsBounced: number;
  spamComplaints: number;
  inboxPlacement: number;
}

// Helper functions
export const createCampaign = async (campaign: Omit<WarmupCampaign, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = doc(campaignsCollection);
  const newCampaign = {
    ...campaign,
    id: docRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(docRef, newCampaign);
  return newCampaign;
};

export const updateCampaign = async (campaignId: string, updates: Partial<WarmupCampaign>) => {
  const docRef = doc(db, 'warmup_campaigns', campaignId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const getUserCampaigns = async (userId: string) => {
  const q = query(
    campaignsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WarmupCampaign));
};