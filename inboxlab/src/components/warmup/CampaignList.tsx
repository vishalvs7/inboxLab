"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Campaign {
  id: string;
  domain: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  dailyEmails: number;
  currentDay: number;
  duration: number;
  inboxRate: number;
  bounceRate: number;
  openRate: number;
  totalEmailsSent: number;
  totalEmailsToSend: number;
  createdAt: string;
}

interface CampaignListProps {
  refreshTrigger?: boolean;
}

export default function CampaignList({ refreshTrigger }: CampaignListProps) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleStorageChange = () => {
      fetchCampaigns();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      // Get campaigns from localStorage
      const storedCampaigns = localStorage.getItem('warmup_campaigns');
      let allCampaigns: Campaign[] = [];
      
      if (storedCampaigns) {
        allCampaigns = JSON.parse(storedCampaigns);
      } else {
        // Default mock campaigns if localStorage is empty
        allCampaigns = [
          {
            id: 'mock-1',
            domain: 'test-domain.com',
            status: 'active',
            dailyEmails: 20,
            currentDay: 5,
            duration: 30,
            inboxRate: 95,
            bounceRate: 0.5,
            openRate: 45,
            totalEmailsSent: 100,
            totalEmailsToSend: 600,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-2',
            domain: 'another-domain.com',
            status: 'completed',
            dailyEmails: 30,
            currentDay: 45,
            duration: 45,
            inboxRate: 97,
            bounceRate: 0.2,
            openRate: 52,
            totalEmailsSent: 1350,
            totalEmailsToSend: 1350,
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ];
        
        localStorage.setItem('warmup_campaigns', JSON.stringify(allCampaigns));
      }
      
      // Sort by creation date (newest first)
      allCampaigns.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setCampaigns(allCampaigns);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        Error loading campaigns: {error}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow border">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No warm-up campaigns yet</h3>
        <p className="text-gray-600 mb-6">Create your first campaign to start building email reputation</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">
          Your Warm-up Campaigns ({campaigns.length})
        </h3>
        <button
          onClick={fetchCampaigns}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => {
          const progress = campaign.totalEmailsToSend > 0 
            ? (campaign.totalEmailsSent / campaign.totalEmailsToSend) * 100 
            : 0;
          
          return (
            <div key={campaign.id} className="bg-white rounded-lg shadow border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{campaign.domain}</h4>
                  <p className="text-sm text-gray-500">Started {formatDate(campaign.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Day {campaign.currentDay} of {campaign.duration} • {campaign.totalEmailsSent} of {campaign.totalEmailsToSend} emails sent
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-lg font-bold text-blue-600">{campaign.dailyEmails}</p>
                    <p className="text-xs text-gray-600">Daily</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-lg font-bold text-green-600">{campaign.inboxRate}%</p>
                    <p className="text-xs text-gray-600">Inbox</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <p className="text-lg font-bold text-yellow-600">{campaign.bounceRate}%</p>
                    <p className="text-xs text-gray-600">Bounce</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="text-lg font-bold text-purple-600">{campaign.openRate}%</p>
                    <p className="text-xs text-gray-600">Open</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}