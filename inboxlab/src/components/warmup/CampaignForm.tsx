"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CampaignFormProps {
  onSuccess?: () => void;
}

export default function CampaignForm({ onSuccess }: CampaignFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    domain: '',
    sendingEmail: user?.email || '',
    dailyEmails: 20,
    duration: 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // This prevents page refresh
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/warmup/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server error: Status ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to create campaign (${response.status})`);
      }

      console.log('Campaign created:', data);
      
      // SAVE TO LOCALSTORAGE (NEW CODE)
      const existingCampaigns = JSON.parse(localStorage.getItem('warmup_campaigns') || '[]');
      const newCampaign = {
        id: data.campaignId,
        domain: formData.domain,
        status: 'active' as const,
        dailyEmails: formData.dailyEmails,
        currentDay: 1,
        duration: formData.duration,
        inboxRate: 0,
        bounceRate: 0,
        openRate: 0,
        totalEmailsSent: 0,
        totalEmailsToSend: formData.dailyEmails * formData.duration,
        createdAt: new Date().toISOString(),
      };
      
      const updatedCampaigns = [newCampaign, ...existingCampaigns];
      localStorage.setItem('warmup_campaigns', JSON.stringify(updatedCampaigns));
      
      // Trigger storage event so CampaignList can update
      window.dispatchEvent(new Event('storage'));
      // END OF NEW CODE
      
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset form after success
      setTimeout(() => {
        setFormData({
          domain: '',
          sendingEmail: user?.email || '',
          dailyEmails: 20,
          duration: 30,
        });
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      console.error('Campaign creation error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyEmails' || name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Create Warm-up Campaign</h3>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error:</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Success!</span>
          </div>
          <p className="mt-1 text-sm">Campaign created successfully! It should appear in the campaigns list below.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain to Warm Up
          </label>
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            placeholder="yourdomain.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter the domain you want to build reputation for
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sending Email Address
          </label>
          <input
            type="email"
            name="sendingEmail"
            value={formData.sendingEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Emails will be sent from this address
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Email Volume
            </label>
            <div className="space-y-2">
              <input
                type="range"
                name="dailyEmails"
                min="10"
                max="100"
                step="5"
                value={formData.dailyEmails}
                onChange={handleChange}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>10</span>
                <span className="font-medium text-blue-600">{formData.dailyEmails} emails/day</span>
                <span>100</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Recommended: 20-30 emails per day for new domains
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warm-up Duration
            </label>
            <div className="space-y-2">
              <input
                type="range"
                name="duration"
                min="14"
                max="60"
                step="1"
                value={formData.duration}
                onChange={handleChange}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>14</span>
                <span className="font-medium text-blue-600">{formData.duration} days</span>
                <span>60</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Most domains need 30+ days for optimal reputation
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Summary:</span> You'll send {formData.dailyEmails} emails per day for {formData.duration} days ({formData.dailyEmails * formData.duration} total emails)
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Campaign...
              </span>
            ) : (
              'Start Warm-up Campaign'
            )}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Note: Using mock mode for testing. Campaigns saved locally in your browser.
          </p>
        </div>
      </form>
    </div>
  );
}