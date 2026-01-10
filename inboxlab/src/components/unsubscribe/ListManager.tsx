"use client";

import { useState } from 'react';

interface Subscriber {
  id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  dateAdded: Date;
  lastContact: Date;
  source: 'import' | 'form' | 'api';
  tags: string[];
}

interface ListManagerProps {
  subscribers: Subscriber[];
  onRemove: (id: string) => void;
  onUpdateStatus: (id: string, status: Subscriber['status']) => void;
  onImport: (emails: string[]) => void;
  onExport: (type: 'all' | 'active' | 'removed') => void;
  onCleanup: () => void;
  loading: boolean;
  stats: {
    total: number;
    subscribed: number;
    unsubscribed: number;
    bounced: number;
    complained: number;
    bounceRate: string;
    unsubscribeRate: string;
    healthScore: string;
  };
}

export default function ListManager({
  subscribers,
  onRemove,
  onUpdateStatus,
  onImport,
  onExport,
  onCleanup,
  loading,
  stats
}: ListManagerProps) {
  const [filter, setFilter] = useState<'all' | 'subscribed' | 'unsubscribed' | 'bounced' | 'complained'>('all');
  const [importText, setImportText] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<Set<string>>(new Set());

  const filteredSubscribers = subscribers.filter(subscriber => {
    if (filter === 'all') return true;
    return subscriber.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'subscribed': return 'bg-green-100 text-green-800';
      case 'unsubscribed': return 'bg-red-100 text-red-800';
      case 'bounced': return 'bg-orange-100 text-orange-800';
      case 'complained': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'subscribed': return '✓';
      case 'unsubscribed': return '✗';
      case 'bounced': return '↩';
      case 'complained': return '⚠';
      default: return '?';
    }
  };

  const handleImport = () => {
    const emails = importText
      .split(/[\n,]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0 && email.includes('@'));
    
    if (emails.length > 0) {
      onImport(emails);
      setImportText('');
      alert(`Imported ${emails.length} subscribers`);
    } else {
      alert('Please enter valid email addresses');
    }
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.size === filteredSubscribers.length) {
      setSelectedSubscribers(new Set());
    } else {
      const allIds = filteredSubscribers.map(s => s.id);
      setSelectedSubscribers(new Set(allIds));
    }
  };

  const toggleSelectSubscriber = (id: string) => {
    const newSelected = new Set(selectedSubscribers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubscribers(newSelected);
  };

  const handleBulkAction = (action: 'unsubscribe' | 'delete') => {
    if (selectedSubscribers.size === 0) {
      alert('Please select subscribers first');
      return;
    }

    if (action === 'unsubscribe') {
      selectedSubscribers.forEach(id => {
        onUpdateStatus(id, 'unsubscribed');
      });
      alert(`Unsubscribed ${selectedSubscribers.size} contacts`);
    } else {
      if (confirm(`Delete ${selectedSubscribers.size} selected contacts?`)) {
        selectedSubscribers.forEach(id => {
          onRemove(id);
        });
      }
    }
    
    setSelectedSubscribers(new Set());
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">List Management</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onExport('all')}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Export All
          </button>
          <button
            onClick={() => onExport('active')}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Export Active
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{stats.subscribed}</div>
          <div className="text-xs text-green-700">Active</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{stats.unsubscribed}</div>
          <div className="text-xs text-red-700">Unsubscribed</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{stats.bounced}</div>
          <div className="text-xs text-orange-700">Bounced</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{stats.complained}</div>
          <div className="text-xs text-purple-700">Complaints</div>
        </div>
      </div>

      {/* Filter & Actions */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'subscribed', 'unsubscribed', 'bounced', 'complained'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({
                status === 'all' ? subscribers.length :
                subscribers.filter(s => s.status === status).length
              })
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedSubscribers.size > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-blue-900">
                  {selectedSubscribers.size} contact{selectedSubscribers.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('unsubscribe')}
                  className="px-3 py-1 bg-white text-red-600 border border-red-300 rounded text-sm hover:bg-red-50"
                >
                  Mark as Unsubscribed
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-white text-red-600 border border-red-300 rounded text-sm hover:bg-red-50"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Import Section */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Import Subscribers</h4>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste email addresses (one per line or comma separated)..."
          className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <div className="flex justify-between mt-2">
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Import Emails
          </button>
          <span className="text-sm text-gray-500">
            {importText.split(/[\n,]+/).filter(e => e.trim()).length} emails detected
          </span>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedSubscribers.size === filteredSubscribers.length && filteredSubscribers.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              {filteredSubscribers.length} contacts
            </span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredSubscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className={`flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                selectedSubscribers.has(subscriber.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedSubscribers.has(subscriber.id)}
                onChange={() => toggleSelectSubscriber(subscriber.id)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              
              <div className="ml-3 flex-shrink-0">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getStatusColor(subscriber.status)}`}>
                  {getStatusIcon(subscriber.status)}
                </span>
              </div>

              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm text-gray-900 truncate">
                    {subscriber.email}
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={subscriber.status}
                      onChange={(e) => onUpdateStatus(subscriber.id, e.target.value as Subscriber['status'])}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="subscribed">Active</option>
                      <option value="unsubscribed">Unsubscribed</option>
                      <option value="bounced">Bounced</option>
                      <option value="complained">Complaint</option>
                    </select>
                    <button
                      onClick={() => onRemove(subscriber.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500">
                  <span>Added: {new Date(subscriber.dateAdded).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Source: {subscriber.source}</span>
                  {subscriber.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span>Tags: {subscriber.tags.join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredSubscribers.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No contacts found with current filter
            </div>
          )}
        </div>
      </div>

      {/* Cleanup Warning */}
      {(stats.unsubscribed > 0 || stats.bounced > 0 || stats.complained > 0) && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-900">
                {stats.unsubscribed + stats.bounced + stats.complained} contacts need attention
              </div>
              <p className="text-sm text-red-700 mt-1">
                These contacts are lowering your deliverability rates
              </p>
            </div>
            <button
              onClick={onCleanup}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Cleaning...' : 'Clean Up Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}