// /src/components/deliverability/DeliveryReports.tsx
"use client";

import { useState } from 'react';

interface DeliveryReportsProps {
  domainTests: Array<{
    id: string;
    domain: string;
    timestamp: Date;
    inboxRate: number;
    spamRate: number;
    score: number;
    status: 'good' | 'warning' | 'poor';
  }>;
  onExport: (format: 'pdf' | 'csv' | 'json') => void;
}

export default function DeliveryReports({ domainTests, onExport }: DeliveryReportsProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  // Filter tests based on time range
  const getFilteredTests = () => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case '24h':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'all':
      default:
        return domainTests;
    }
    
    return domainTests.filter(test => new Date(test.timestamp) >= cutoffDate);
  };

  // Filter by domain
  const getDomainFilteredTests = () => {
    const timeFiltered = getFilteredTests();
    if (selectedDomain === 'all') return timeFiltered;
    return timeFiltered.filter(test => test.domain === selectedDomain);
  };

  const filteredTests = getDomainFilteredTests();

  // Get unique domains
  const domains = Array.from(new Set(domainTests.map(test => test.domain)));

  // Calculate trends
  const calculateTrends = () => {
    if (filteredTests.length < 2) return null;
    
    const sortedTests = [...filteredTests].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const oldest = sortedTests[0];
    const newest = sortedTests[sortedTests.length - 1];
    
    const inboxTrend = newest.inboxRate - oldest.inboxRate;
    const spamTrend = newest.spamRate - oldest.spamRate;
    const scoreTrend = newest.score - oldest.score;
    
    return { inboxTrend, spamTrend, scoreTrend };
  };

  const trends = calculateTrends();

  const getTrendIcon = (value: number) => {
    if (value > 0) return '↗';
    if (value < 0) return '↘';
    return '→';
  };

  const getTrendColor = (value: number, reverse: boolean = false) => {
    if (reverse) {
      return value > 0 ? 'text-red-600' : value < 0 ? 'text-green-600' : 'text-gray-600';
    }
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Delivery Reports</h2>
          <p className="text-gray-600">Historical deliverability data and trends</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onExport('csv')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport('json')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border p-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600">
              Showing {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''}
              {trends && (
                <span className="ml-2">
                  • Trend: 
                  <span className={`ml-1 ${getTrendColor(trends.inboxTrend)}`}>
                    {getTrendIcon(trends.inboxTrend)} {Math.abs(trends.inboxTrend).toFixed(1)}% inbox
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trends Overview */}
      {filteredTests.length > 0 && (
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Performance Trends</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Average Inbox Rate</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {(filteredTests.reduce((sum, test) => sum + test.inboxRate, 0) / filteredTests.length).toFixed(1)}%
                </div>
                {trends && (
                  <div className={`text-sm ${getTrendColor(trends.inboxTrend)}`}>
                    {getTrendIcon(trends.inboxTrend)} {Math.abs(trends.inboxTrend).toFixed(1)}% from start
                  </div>
                )}
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Average Spam Rate</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {(filteredTests.reduce((sum, test) => sum + test.spamRate, 0) / filteredTests.length).toFixed(1)}%
                </div>
                {trends && (
                  <div className={`text-sm ${getTrendColor(trends.spamTrend, true)}`}>
                    {getTrendIcon(trends.spamTrend)} {Math.abs(trends.spamTrend).toFixed(1)}% from start
                  </div>
                )}
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Average Score</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.round(filteredTests.reduce((sum, test) => sum + test.score, 0) / filteredTests.length)}
                </div>
                {trends && (
                  <div className={`text-sm ${getTrendColor(trends.scoreTrend)}`}>
                    {getTrendIcon(trends.scoreTrend)} {Math.abs(trends.scoreTrend).toFixed(0)} points from start
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test History Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Test History</h3>
        </div>
        <div className="p-0">
          {filteredTests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Domain</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Test Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Inbox Rate</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Spam Rate</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Score</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="py-3 px-6">
                        <div className="font-medium text-gray-900">{test.domain}</div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-sm text-gray-900">
                          {new Date(test.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(test.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="h-2 rounded-full bg-green-500"
                              style={{ width: `${test.inboxRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{test.inboxRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="h-2 rounded-full bg-red-500"
                              style={{ width: `${test.spamRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{test.spamRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          test.score >= 90 ? 'bg-green-100 text-green-800' :
                          test.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {test.score}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          test.status === 'good' ? 'bg-green-100 text-green-800' :
                          test.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {test.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Data</h3>
              <p className="text-gray-600">Run some tests to see reports here</p>
            </div>
          )}
        </div>
      </div>

      {/* Domain Comparison */}
      {domains.length > 1 && (
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Domain Comparison</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Domain</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Tests</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Avg Inbox</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Avg Spam</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Avg Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Best Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {domains.map(domain => {
                    const domainTests = filteredTests.filter(test => test.domain === domain);
                    if (domainTests.length === 0) return null;
                    
                    const avgInbox = domainTests.reduce((sum, test) => sum + test.inboxRate, 0) / domainTests.length;
                    const avgSpam = domainTests.reduce((sum, test) => sum + test.spamRate, 0) / domainTests.length;
                    const avgScore = domainTests.reduce((sum, test) => sum + test.score, 0) / domainTests.length;
                    const bestScore = Math.max(...domainTests.map(test => test.score));
                    const status = avgScore >= 90 ? 'good' : avgScore >= 70 ? 'warning' : 'poor';
                    
                    return (
                      <tr key={domain} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{domain}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{domainTests.length}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="h-2 rounded-full bg-green-500"
                                style={{ width: `${avgInbox}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{avgInbox.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="h-2 rounded-full bg-red-500"
                                style={{ width: `${avgSpam}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{avgSpam.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            avgScore >= 90 ? 'bg-green-100 text-green-800' :
                            avgScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {avgScore.toFixed(0)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            bestScore >= 90 ? 'bg-green-100 text-green-800' :
                            bestScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {bestScore}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            status === 'good' ? 'bg-green-100 text-green-800' :
                            status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}