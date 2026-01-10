"use client";

import { useState } from 'react';

interface EmailResult {
  id: string;
  email: string;
  status: 'valid' | 'invalid' | 'risky' | 'disposable' | 'role';
  reason?: string;
  confidence: number;
  verifiedAt: Date;
}

interface VerificationResultsProps {
  results: EmailResult[];
  onExport: (type: 'valid' | 'all' | 'invalid') => void;
}

export default function VerificationResults({ results, onExport }: VerificationResultsProps) {
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid' | 'risky' | 'disposable' | 'role'>('all');
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  const filteredResults = results.filter(result => {
    if (filter === 'all') return true;
    return result.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'risky': return 'bg-yellow-100 text-yellow-800';
      case 'disposable': return 'bg-orange-100 text-orange-800';
      case 'role': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return '✓';
      case 'invalid': return '✗';
      case 'risky': return '⚠';
      case 'disposable': return '♻';
      case 'role': return '👔';
      default: return '?';
    }
  };

  const toggleSelectAll = () => {
    if (selectedEmails.size === filteredResults.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(filteredResults.map(r => r.id)));
    }
  };

  const toggleSelectEmail = (id: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmails(newSelected);
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Verification Results</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {filteredResults.length} of {results.length} emails
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {(['all', 'valid', 'invalid', 'risky', 'disposable', 'role'] as const).map((status) => {
            const count = results.filter(r => status === 'all' || r.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Actions */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <button
          onClick={() => onExport('valid')}
          className="py-2 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100"
        >
          Export Valid
        </button>
        <button
          onClick={() => onExport('invalid')}
          className="py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100"
        >
          Export Invalid
        </button>
        <button
          onClick={() => onExport('all')}
          className="py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100"
        >
          Export All
        </button>
      </div>

      {/* Results Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedEmails.size === filteredResults.length && filteredResults.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Select all ({selectedEmails.size} selected)
            </span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              className={`flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                selectedEmails.has(result.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedEmails.has(result.id)}
                onChange={() => toggleSelectEmail(result.id)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              
              <div className="ml-3 flex-shrink-0">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                </span>
              </div>

              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm text-gray-900">{result.email}</div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{result.confidence}%</span>
                  </div>
                </div>
                
                {result.reason && (
                  <div className="mt-1 text-xs text-gray-600">
                    {result.reason}
                  </div>
                )}

                <div className="mt-1 text-xs text-gray-500">
                  Verified at {new Date(result.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {filteredResults.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No emails found with current filter
            </div>
          )}
        </div>
      </div>

      {/* Selected Actions */}
      {selectedEmails.size > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-blue-900">
                {selectedEmails.size} email{selectedEmails.size !== 1 ? 's' : ''} selected
              </span>
              <p className="text-sm text-blue-700 mt-1">
                Choose an action for selected emails
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-white text-blue-600 border border-blue-300 rounded text-sm hover:bg-blue-50">
                Mark as Valid
              </button>
              <button className="px-3 py-1 bg-white text-red-600 border border-red-300 rounded text-sm hover:bg-red-50">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}