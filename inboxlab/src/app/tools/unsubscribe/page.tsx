"use client";

import { useState, useEffect } from 'react';
import ListManager from '@/components/unsubscribe/ListManager';
import BounceDetector from '@/components/unsubscribe/BounceDetector';
import WebhookSimulator from '@/components/unsubscribe/WebhookSimulator';
import CleanupHistory from '@/components/unsubscribe/CleanupHistory';

interface Subscriber {
  id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  dateAdded: Date;
  lastContact: Date;
  source: 'import' | 'form' | 'api';
  tags: string[];
}

interface CleanupHistoryItem {
  id: string;
  timestamp: Date;
  removedCount: number;
  listSizeBefore: number;
  listSizeAfter: number;
  removedTypes: {
    unsubscribes: number;
    bounces: number;
    complaints: number;
  };
}

export default function UnsubscribeManagerPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [cleanupHistory, setCleanupHistory] = useState<CleanupHistoryItem[]>([]);

  // Load initial sample data
  useEffect(() => {
    loadSampleData();
    
    // Load history from localStorage
    const savedHistory = localStorage.getItem('unsubscribe_cleanup_history');
    if (savedHistory) {
      try {
        setCleanupHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load cleanup history:', e);
      }
    }
  }, []);

  const loadSampleData = () => {
    const sampleSubscribers: Subscriber[] = [
      { id: '1', email: 'john@example.com', status: 'subscribed', dateAdded: new Date('2024-01-01'), lastContact: new Date('2024-01-10'), source: 'form', tags: ['customer', 'active'] },
      { id: '2', email: 'sarah@company.com', status: 'unsubscribed', dateAdded: new Date('2024-01-02'), lastContact: new Date('2024-01-05'), source: 'import', tags: ['lead'] },
      { id: '3', email: 'mike@business.com', status: 'bounced', dateAdded: new Date('2024-01-03'), lastContact: new Date('2024-01-08'), source: 'api', tags: ['customer'] },
      { id: '4', email: 'lisa@startup.com', status: 'subscribed', dateAdded: new Date('2024-01-04'), lastContact: new Date('2024-01-12'), source: 'form', tags: ['prospect'] },
      { id: '5', email: 'admin@olddomain.com', status: 'bounced', dateAdded: new Date('2023-12-01'), lastContact: new Date('2023-12-15'), source: 'import', tags: ['inactive'] },
      { id: '6', email: 'contact@website.com', status: 'complained', dateAdded: new Date('2024-01-05'), lastContact: new Date('2024-01-07'), source: 'form', tags: [] },
      { id: '7', email: 'newsletter@reader.com', status: 'subscribed', dateAdded: new Date('2024-01-06'), lastContact: new Date('2024-01-14'), source: 'form', tags: ['engaged'] },
      { id: '8', email: 'support@service.com', status: 'unsubscribed', dateAdded: new Date('2024-01-07'), lastContact: new Date('2024-01-09'), source: 'api', tags: ['customer'] },
      { id: '9', email: 'info@corporation.com', status: 'subscribed', dateAdded: new Date('2024-01-08'), lastContact: new Date('2024-01-13'), source: 'import', tags: ['partner'] },
      { id: '10', email: 'sales@enterprise.com', status: 'subscribed', dateAdded: new Date('2024-01-09'), lastContact: new Date('2024-01-15'), source: 'form', tags: ['hot-lead'] },
      { id: '11', email: 'bounced@invalid.com', status: 'bounced', dateAdded: new Date('2023-11-01'), lastContact: new Date('2023-11-10'), source: 'import', tags: ['old'] },
      { id: '12', email: 'unsub@quit.com', status: 'unsubscribed', dateAdded: new Date('2024-01-10'), lastContact: new Date('2024-01-11'), source: 'form', tags: [] },
    ];
    setSubscribers(sampleSubscribers);
  };

  const runCleanup = () => {
    setLoading(true);
    
    // Simulate cleanup process
    setTimeout(() => {
      const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed');
      const bounced = subscribers.filter(s => s.status === 'bounced');
      const complained = subscribers.filter(s => s.status === 'complained');
      
      const removedCount = unsubscribed.length + bounced.length + complained.length;
      const listSizeBefore = subscribers.length;
      
      // Remove unsubscribed, bounced, and complained emails
      const cleanedSubscribers = subscribers.filter(s => 
        s.status === 'subscribed'
      );
      
      // Create history record
      const historyItem: CleanupHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        removedCount,
        listSizeBefore,
        listSizeAfter: cleanedSubscribers.length,
        removedTypes: {
          unsubscribes: unsubscribed.length,
          bounces: bounced.length,
          complaints: complained.length
        }
      };
      
      setSubscribers(cleanedSubscribers);
      
      // Update history
      const updatedHistory = [historyItem, ...cleanupHistory.slice(0, 9)]; // Keep last 10
      setCleanupHistory(updatedHistory);
      localStorage.setItem('unsubscribe_cleanup_history', JSON.stringify(updatedHistory));
      
      setLoading(false);
      
      alert(`Cleanup complete! Removed ${removedCount} contacts. List reduced from ${listSizeBefore} to ${cleanedSubscribers.length} contacts.`);
      
    }, 1500);
  };

  const simulateWebhook = (type: 'unsubscribe' | 'bounce' | 'complaint', email: string) => {
    setSubscribers(prev => prev.map(subscriber => 
      subscriber.email === email 
        ? { ...subscriber, status: type === 'unsubscribe' ? 'unsubscribed' : type === 'bounce' ? 'bounced' : 'complained' }
        : subscriber
    ));
  };

  const addTestSubscriber = (email: string, status: Subscriber['status'] = 'subscribed') => {
    const newSubscriber: Subscriber = {
      id: Date.now().toString(),
      email,
      status,
      dateAdded: new Date(),
      lastContact: new Date(),
      source: 'form',
      tags: ['test']
    };
    setSubscribers([...subscribers, newSubscriber]);
  };

  const removeSubscriber = (id: string) => {
    setSubscribers(subscribers.filter(s => s.id !== id));
  };

  const updateSubscriberStatus = (id: string, status: Subscriber['status']) => {
    setSubscribers(subscribers.map(s => 
      s.id === id ? { ...s, status } : s
    ));
  };

  const importSubscribers = (emails: string[]) => {
    const newSubscribers = emails.map(email => ({
      id: Date.now().toString() + Math.random(),
      email,
      status: 'subscribed' as const,
      dateAdded: new Date(),
      lastContact: new Date(),
      source: 'import' as const,
      tags: ['imported']
    }));
    setSubscribers([...subscribers, ...newSubscribers]);
  };

  const exportList = (type: 'all' | 'active' | 'removed') => {
    let data = '';
    
    if (type === 'active') {
      const active = subscribers.filter(s => s.status === 'subscribed');
      data = active.map(s => s.email).join('\n');
    } else if (type === 'removed') {
      const removed = cleanupHistory.flatMap(history => 
        Array(history.removedTypes.unsubscribes + history.removedTypes.bounces + history.removedTypes.complaints).fill('removed@example.com')
      );
      data = removed.join('\n');
    } else {
      data = subscribers.map(s => `${s.email},${s.status},${s.dateAdded.toISOString()}`).join('\n');
    }
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const total = subscribers.length;
    const subscribed = subscribers.filter(s => s.status === 'subscribed').length;
    const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length;
    const bounced = subscribers.filter(s => s.status === 'bounced').length;
    const complained = subscribers.filter(s => s.status === 'complained').length;
    
    const bounceRate = total > 0 ? (bounced / total) * 100 : 0;
    const unsubscribeRate = total > 0 ? (unsubscribed / total) * 100 : 0;
    
    return {
      total,
      subscribed,
      unsubscribed,
      bounced,
      complained,
      bounceRate: bounceRate.toFixed(1),
      unsubscribeRate: unsubscribeRate.toFixed(1),
      healthScore: Math.max(0, 100 - bounceRate - unsubscribeRate).toFixed(1)
    };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unsubscribe Manager</h1>
        <p className="text-gray-600">
          Automatically remove unsubscribes, bounces, and complaints from your email lists. Maintain list hygiene and improve deliverability.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Contacts</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.subscribed}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">{stats.unsubscribed}</div>
          <div className="text-sm text-gray-600">Unsubscribed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">{stats.bounced}</div>
          <div className="text-sm text-gray-600">Bounced</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">{stats.healthScore}%</div>
          <div className="text-sm text-gray-600">List Health</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {['list', 'bounce', 'webhook', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'list' && 'List Management'}
              {tab === 'bounce' && 'Bounce Detection'}
              {tab === 'webhook' && 'Webhook Simulator'}
              {tab === 'history' && 'Cleanup History'}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'list' && (
            <ListManager
              subscribers={subscribers}
              onRemove={removeSubscriber}
              onUpdateStatus={updateSubscriberStatus}
              onImport={importSubscribers}
              onExport={exportList}
              onCleanup={runCleanup}
              loading={loading}
              stats={stats}
            />
          )}

          {activeTab === 'bounce' && (
            <BounceDetector
              subscribers={subscribers}
              onDetectBounces={() => {
                // Simulate bounce detection
                const potentialBounces = subscribers
                  .filter(s => s.status === 'subscribed')
                  .filter(() => Math.random() > 0.7);
                
                if (potentialBounces.length > 0) {
                  setSubscribers(prev => prev.map(s => 
                    potentialBounces.some(pb => pb.id === s.id) 
                      ? { ...s, status: 'bounced' }
                      : s
                  ));
                  alert(`Detected ${potentialBounces.length} new bounces`);
                } else {
                  alert('No new bounces detected');
                }
              }}
            />
          )}

          {activeTab === 'webhook' && (
            <WebhookSimulator
              onSimulate={simulateWebhook}
              onAddTest={addTestSubscriber}
            />
          )}

          {activeTab === 'history' && cleanupHistory.length > 0 && (
            <CleanupHistory history={cleanupHistory} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cleanup Card */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Cleanup</h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-900">Ready to Remove</span>
                  <span className="text-lg font-bold text-red-600">
                    {stats.unsubscribed + stats.bounced + stats.complained}
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  Unsubscribed: {stats.unsubscribed} • Bounced: {stats.bounced} • Complaints: {stats.complained}
                </p>
              </div>

              <button
                onClick={runCleanup}
                disabled={loading || (stats.unsubscribed + stats.bounced + stats.complained) === 0}
                className="w-full py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cleaning...
                  </span>
                ) : (
                  'Run Cleanup Now'
                )}
              </button>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Schedule Cleanup</div>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>After each campaign</option>
                </select>
              </div>
            </div>
          </div>

          {/* Integration Status */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Integrations</h3>
            <div className="space-y-3">
              {['Mailchimp', 'SendGrid', 'Mailgun', 'Amazon SES', 'ConvertKit'].map((service) => (
                <div key={service} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                      <span className="font-bold text-gray-700">{service.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-gray-900">{service}</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Connected</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600">
              + Add Integration
            </button>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Best Practices</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Remove unsubscribes immediately</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Process bounces within 24 hours</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Monitor complaint rates weekly</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Keep bounce rate under 2%</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Archive removed contacts for 30 days</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}