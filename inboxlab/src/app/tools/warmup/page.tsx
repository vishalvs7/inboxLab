"use client";

import { useState } from 'react';
import CampaignForm from '@/components/warmup/CampaignForm';
import CampaignList from '@/components/warmup/CampaignList';

export default function WarmupToolPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    // Trigger refresh of campaign list
    setRefreshTrigger(prev => !prev);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Warm-up Tool</h1>
        <p className="text-gray-600">
          Build email reputation with automated daily sending. Gradually increase volume to avoid spam filters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {showForm ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Campaign</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
              <CampaignForm onSuccess={handleSuccess} />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Your Campaigns</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  + New Campaign
                </button>
              </div>
              <CampaignList refreshTrigger={refreshTrigger} />
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* How It Works */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <p className="text-gray-700">Configure your domain and daily volume</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <p className="text-gray-700">We send warm-up emails to verified addresses</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <p className="text-gray-700">Gradually increase volume over 30+ days</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm font-bold">4</span>
                </div>
                <p className="text-gray-700">Monitor deliverability metrics in real-time</p>
              </li>
            </ol>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Best Practices</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Start Conservatively</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Begin with 10-20 emails/day for new domains
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Monitor Daily</p>
                <p className="text-xs text-green-700 mt-1">
                  Check bounce rates and adjust volume accordingly
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Be Patient</p>
                <p className="text-xs text-blue-700 mt-1">
                  Reputation builds gradually over 30+ days
                </p>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Average Inbox Rate</span>
                  <span className="font-medium text-green-600">96.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '96.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Average Bounce Rate</span>
                  <span className="font-medium text-red-600">0.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '0.8%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                    <p className="text-xs text-gray-600">Total Emails Sent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{2 + refreshTrigger ? 1 : 0}</p>
                    <p className="text-xs text-gray-600">Active Campaigns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}