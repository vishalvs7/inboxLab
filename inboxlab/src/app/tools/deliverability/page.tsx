"use client";

import { useState, useEffect } from 'react';
import InboxPlacementTester from '@/components/deliverability/InboxPlacementTester';
import DeliveryReports from '@/components/deliverability/DeliveryReports';
import ReputationManager from '@/components/deliverability/ReputationManager';
import SpamAnalysis from '@/components/deliverability/SpamAnalysis';

interface DomainTest {
  id: string;
  domain: string;
  timestamp: Date;
  inboxRate: number;
  spamRate: number;
  missingRate: number;
  score: number;
  status: 'good' | 'warning' | 'poor';
  ispResults: IspResult[];
}

interface IspResult {
  isp: string;
  placement: 'inbox' | 'spam' | 'missing';
  delay: number; // seconds
  reputation: number; // 0-100
}

interface DomainReputation {
  domain: string;
  score: number;
  lastUpdated: Date;
  spf: boolean;
  dkim: boolean;
  dmarc: boolean;
  blacklists: string[];
  volume: number; // emails per day
  bounceRate: number;
  complaintRate: number;
}

interface SpamFilterTest {
  id: string;
  filterName: string;
  score: number;
  triggeredRules: string[];
  recommendations: string[];
}

export default function EmailDeliverabilityMonitorPage() {
  const [domainTests, setDomainTests] = useState<DomainTest[]>([]);
  const [activeTest, setActiveTest] = useState<DomainTest | null>(null);
  const [domainReputations, setDomainReputations] = useState<DomainReputation[]>([]);
  const [spamTests, setSpamTests] = useState<SpamFilterTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tester');

  // Load initial sample data
  useEffect(() => {
    loadSampleData();
    
    // Load saved tests from localStorage
    const savedTests = localStorage.getItem('deliverability_tests');
    if (savedTests) {
      try {
        setDomainTests(JSON.parse(savedTests));
      } catch (e) {
        console.error('Failed to load saved tests:', e);
      }
    }
  }, []);

  const loadSampleData = () => {
    // Sample domain tests
    const sampleTests: DomainTest[] = [
      {
        id: '1',
        domain: 'mycompany.com',
        timestamp: new Date('2024-01-15T10:30:00'),
        inboxRate: 94.2,
        spamRate: 3.8,
        missingRate: 2.0,
        score: 92,
        status: 'good',
        ispResults: [
          { isp: 'Gmail', placement: 'inbox', delay: 2, reputation: 95 },
          { isp: 'Outlook', placement: 'inbox', delay: 5, reputation: 88 },
          { isp: 'Yahoo', placement: 'inbox', delay: 3, reputation: 90 },
          { isp: 'iCloud', placement: 'spam', delay: 1, reputation: 75 },
          { isp: 'AOL', placement: 'inbox', delay: 10, reputation: 82 }
        ]
      },
      {
        id: '2',
        domain: 'startup-email.com',
        timestamp: new Date('2024-01-14T14:15:00'),
        inboxRate: 78.5,
        spamRate: 18.2,
        missingRate: 3.3,
        score: 67,
        status: 'warning',
        ispResults: [
          { isp: 'Gmail', placement: 'spam', delay: 15, reputation: 65 },
          { isp: 'Outlook', placement: 'inbox', delay: 8, reputation: 72 },
          { isp: 'Yahoo', placement: 'inbox', delay: 4, reputation: 78 },
          { isp: 'iCloud', placement: 'spam', delay: 2, reputation: 60 },
          { isp: 'AOL', placement: 'missing', delay: 30, reputation: 55 }
        ]
      },
      {
        id: '3',
        domain: 'newsletter-service.net',
        timestamp: new Date('2024-01-13T09:00:00'),
        inboxRate: 99.1,
        spamRate: 0.5,
        missingRate: 0.4,
        score: 98,
        status: 'good',
        ispResults: [
          { isp: 'Gmail', placement: 'inbox', delay: 1, reputation: 99 },
          { isp: 'Outlook', placement: 'inbox', delay: 3, reputation: 96 },
          { isp: 'Yahoo', placement: 'inbox', delay: 2, reputation: 97 },
          { isp: 'iCloud', placement: 'inbox', delay: 1, reputation: 98 },
          { isp: 'AOL', placement: 'inbox', delay: 5, reputation: 94 }
        ]
      }
    ];

    // Sample domain reputations
    const sampleReputations: DomainReputation[] = [
      {
        domain: 'mycompany.com',
        score: 92,
        lastUpdated: new Date('2024-01-15'),
        spf: true,
        dkim: true,
        dmarc: true,
        blacklists: [],
        volume: 5000,
        bounceRate: 0.8,
        complaintRate: 0.02
      },
      {
        domain: 'startup-email.com',
        score: 67,
        lastUpdated: new Date('2024-01-14'),
        spf: true,
        dkim: false,
        dmarc: false,
        blacklists: ['Spamhaus', 'Barracuda'],
        volume: 20000,
        bounceRate: 3.2,
        complaintRate: 0.15
      },
      {
        domain: 'newsletter-service.net',
        score: 98,
        lastUpdated: new Date('2024-01-13'),
        spf: true,
        dkim: true,
        dmarc: true,
        blacklists: [],
        volume: 100000,
        bounceRate: 0.5,
        complaintRate: 0.01
      }
    ];

    // Sample spam filter tests
    const sampleSpamTests: SpamFilterTest[] = [
      {
        id: '1',
        filterName: 'Gmail Spam Filter',
        score: 85,
        triggeredRules: ['Suspicious links', 'Too many images'],
        recommendations: ['Reduce image-to-text ratio', 'Authenticate all links']
      },
      {
        id: '2',
        filterName: 'Outlook Junk Filter',
        score: 92,
        triggeredRules: ['Unverified sender'],
        recommendations: ['Improve domain reputation', 'Add BIMI record']
      },
      {
        id: '3',
        filterName: 'SpamAssassin',
        score: 78,
        triggeredRules: ['HTML only', 'No text version', 'Sales keywords'],
        recommendations: ['Add plain text version', 'Modify subject line']
      }
    ];

    setDomainTests(sampleTests);
    setActiveTest(sampleTests[0]);
    setDomainReputations(sampleReputations);
    setSpamTests(sampleSpamTests);
  };

  const runDomainTest = (domain: string) => {
    setLoading(true);
    
    // Simulate testing
    setTimeout(() => {
      const inboxRate = 80 + Math.random() * 20; // 80-100%
      const spamRate = 100 - inboxRate - (Math.random() * 5);
      const missingRate = 100 - inboxRate - spamRate;
      const score = Math.floor(inboxRate - (spamRate * 2));
      const status = score >= 90 ? 'good' : score >= 70 ? 'warning' : 'poor';
      
      const isps = ['Gmail', 'Outlook', 'Yahoo', 'iCloud', 'AOL', 'Proton Mail', 'Zoho'];
      const ispResults: IspResult[] = isps.map(isp => {
        const placement = Math.random() > 0.7 ? 'spam' : Math.random() > 0.9 ? 'missing' : 'inbox';
        const delay = Math.floor(Math.random() * 30) + 1;
        const reputation = Math.floor(60 + Math.random() * 40);
        
        return { isp, placement, delay, reputation };
      });

      const newTest: DomainTest = {
        id: Date.now().toString(),
        domain,
        timestamp: new Date(),
        inboxRate: parseFloat(inboxRate.toFixed(1)),
        spamRate: parseFloat(spamRate.toFixed(1)),
        missingRate: parseFloat(missingRate.toFixed(1)),
        score: Math.max(0, Math.min(100, score)),
        status,
        ispResults
      };

      setDomainTests([newTest, ...domainTests]);
      setActiveTest(newTest);
      
      // Update localStorage
      localStorage.setItem('deliverability_tests', JSON.stringify([newTest, ...domainTests]));
      
      setLoading(false);
      
      alert(`Test complete for ${domain}! Inbox rate: ${newTest.inboxRate}%, Score: ${newTest.score}/100`);
      
    }, 2000);
  };

  const runSpamAnalysis = (emailContent: string) => {
    setLoading(true);
    
    setTimeout(() => {
      const score = Math.floor(60 + Math.random() * 40);
      const triggeredRules = [];
      const recommendations = [];
      
      if (Math.random() > 0.5) triggeredRules.push('Suspicious links');
      if (Math.random() > 0.6) triggeredRules.push('Too many images');
      if (Math.random() > 0.7) triggeredRules.push('Sales language');
      if (Math.random() > 0.8) triggeredRules.push('HTML only');
      
      if (triggeredRules.includes('Suspicious links')) recommendations.push('Use authenticated links');
      if (triggeredRules.includes('Too many images')) recommendations.push('Maintain 60/40 text-to-image ratio');
      if (triggeredRules.includes('Sales language')) recommendations.push('Reduce promotional language');
      if (triggeredRules.includes('HTML only')) recommendations.push('Add plain text version');
      
      const newSpamTest: SpamFilterTest = {
        id: Date.now().toString(),
        filterName: 'Composite Spam Filter Analysis',
        score,
        triggeredRules: triggeredRules.length > 0 ? triggeredRules : ['No spam triggers detected'],
        recommendations: recommendations.length > 0 ? recommendations : ['Email content looks good for deliverability']
      };
      
      setSpamTests([newSpamTest, ...spamTests.slice(0, 4)]); // Keep last 5
      setLoading(false);
      setActiveTab('spam');
      
      alert(`Spam analysis complete! Score: ${score}/100`);
      
    }, 1500);
  };

  const addDomainToMonitor = (domain: string) => {
    const newReputation: DomainReputation = {
      domain,
      score: 50 + Math.random() * 50,
      lastUpdated: new Date(),
      spf: Math.random() > 0.3,
      dkim: Math.random() > 0.4,
      dmarc: Math.random() > 0.5,
      blacklists: Math.random() > 0.8 ? ['Spamhaus'] : [],
      volume: Math.floor(Math.random() * 100000),
      bounceRate: parseFloat((Math.random() * 5).toFixed(1)),
      complaintRate: parseFloat((Math.random() * 0.2).toFixed(3))
    };
    
    setDomainReputations([...domainReputations, newReputation]);
    alert(`Added ${domain} to monitoring`);
  };

  const fixDomainIssue = (domain: string, issue: 'spf' | 'dkim' | 'dmarc') => {
    setDomainReputations(prev => prev.map(rep => 
      rep.domain === domain ? { ...rep, [issue]: true } : rep
    ));
    alert(`Fixed ${issue.toUpperCase()} for ${domain}`);
  };

  const exportReport = (format: 'pdf' | 'csv' | 'json') => {
    let data = '';
    let filename = '';
    let mimeType = '';
    
    const reportData = {
      generated: new Date().toISOString(),
      domainTests: domainTests.slice(0, 10),
      domainReputations,
      spamTests: spamTests.slice(0, 5)
    };
    
    switch (format) {
      case 'json':
        data = JSON.stringify(reportData, null, 2);
        filename = 'deliverability-report.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        // Simplified CSV export
        data = 'Domain,Test Date,Inbox Rate,Spam Rate,Score,Status\n';
        domainTests.forEach(test => {
          data += `${test.domain},${test.timestamp.toISOString()},${test.inboxRate}%,${test.spamRate}%,${test.score},${test.status}\n`;
        });
        filename = 'deliverability-report.csv';
        mimeType = 'text/csv';
        break;
      case 'pdf':
        // For PDF, we'll just alert since actual PDF generation requires a library
        alert('PDF export would require additional libraries. Use JSON or CSV export for now.');
        return;
    }
    
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    if (domainTests.length === 0) {
      return {
        avgInboxRate: 0,
        avgSpamRate: 0,
        avgScore: 0,
        monitoredDomains: domainReputations.length,
        totalTests: domainTests.length,
        goodDomains: 0,
        warningDomains: 0,
        poorDomains: 0
      };
    }
    
    const avgInboxRate = domainTests.reduce((sum, test) => sum + test.inboxRate, 0) / domainTests.length;
    const avgSpamRate = domainTests.reduce((sum, test) => sum + test.spamRate, 0) / domainTests.length;
    const avgScore = domainTests.reduce((sum, test) => sum + test.score, 0) / domainTests.length;
    
    const goodDomains = domainReputations.filter(d => d.score >= 90).length;
    const warningDomains = domainReputations.filter(d => d.score >= 70 && d.score < 90).length;
    const poorDomains = domainReputations.filter(d => d.score < 70).length;
    
    return {
      avgInboxRate: parseFloat(avgInboxRate.toFixed(1)),
      avgSpamRate: parseFloat(avgSpamRate.toFixed(1)),
      avgScore: parseFloat(avgScore.toFixed(1)),
      monitoredDomains: domainReputations.length,
      totalTests: domainTests.length,
      goodDomains,
      warningDomains,
      poorDomains
    };
  };

  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Deliverability Monitor</h1>
        <p className="text-gray-600">
          Track inbox placement rates, domain reputation, and spam filter performance across major ISPs.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{stats.avgInboxRate}%</div>
          <div className="text-sm text-gray-600">Avg Inbox Rate</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">{stats.avgSpamRate}%</div>
          <div className="text-sm text-gray-600">Avg Spam Rate</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{stats.avgScore}</div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.goodDomains}</div>
          <div className="text-sm text-gray-600">Good Domains</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">{stats.monitoredDomains}</div>
          <div className="text-sm text-gray-600">Monitored</div>
        </div>
      </div>

      {/* Domain Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tests</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const domain = prompt('Enter domain to test (e.g., example.com):');
                if (domain) runDomainTest(domain);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              + New Test
            </button>
            <button
              onClick={() => {
                const domain = prompt('Enter domain to monitor:');
                if (domain) addDomainToMonitor(domain);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              + Monitor Domain
            </button>
          </div>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {domainTests.map(test => (
            <button
              key={test.id}
              onClick={() => setActiveTest(test)}
              className={`px-4 py-3 rounded-lg border flex-shrink-0 ${
                activeTest?.id === test.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{test.domain}</div>
              <div className="flex items-center">
                <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(test.status)}`}>
                  {test.score}/100
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {test.inboxRate}% inbox
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {['tester', 'reports', 'reputation', 'spam'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'tester' && 'Inbox Placement'}
              {tab === 'reports' && 'Delivery Reports'}
              {tab === 'reputation' && 'Reputation Manager'}
              {tab === 'spam' && 'Spam Analysis'}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'tester' && activeTest && (
            <InboxPlacementTester
              test={activeTest}
              onRunTest={() => runDomainTest(activeTest.domain)}
              loading={loading}
            />
          )}

          {activeTab === 'reports' && domainTests.length > 0 && (
            <DeliveryReports
              domainTests={domainTests}
              onExport={exportReport}
            />
          )}

          {activeTab === 'reputation' && domainReputations.length > 0 && (
            <ReputationManager
              domainReputations={domainReputations}
              onFixIssue={fixDomainIssue}
            />
          )}

          {activeTab === 'spam' && spamTests.length > 0 && (
            <SpamAnalysis
              spamTests={spamTests}
              onRunAnalysis={runSpamAnalysis}
              loading={loading}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Test Card */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Test</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-900">Current Domain</span>
                  <span className="text-lg font-bold text-blue-600">
                    {activeTest?.domain || 'None selected'}
                  </span>
                </div>
                {activeTest && (
                  <p className="text-sm text-blue-700">
                    Last test: {activeTest.inboxRate}% inbox rate
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter domain (e.g., example.com)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue={activeTest?.domain || ''}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                      runDomainTest((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (input.value) runDomainTest(input.value);
                  }}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Deliverability'}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Schedule Testing</div>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Daily at 8 AM</option>
                  <option>Weekly (Monday)</option>
                  <option>After each campaign</option>
                  <option>Manual only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Domain Health */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Domain Health</h3>
            <div className="space-y-4">
              {domainReputations.slice(0, 3).map(domain => (
                <div key={domain.domain} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{domain.domain}</span>
                    <span className={`text-sm font-bold ${
                      domain.score >= 90 ? 'text-green-600' :
                      domain.score >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {domain.score}/100
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className={`px-1.5 py-0.5 rounded ${domain.spf ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      SPF {domain.spf ? '✓' : '✗'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${domain.dkim ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      DKIM {domain.dkim ? '✓' : '✗'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${domain.dmarc ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      DMARC {domain.dmarc ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
              {domainReputations.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No domains being monitored
                </div>
              )}
            </div>
            <button
              onClick={() => {
                const domain = prompt('Add domain to monitor:');
                if (domain) addDomainToMonitor(domain);
              }}
              className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600"
            >
              + Add Domain
            </button>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Deliverability Tips</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Keep spam rate below 2%</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Implement SPF, DKIM, and DMARC</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Maintain bounce rate under 5%</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Warm up new domains gradually</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Monitor blacklists weekly</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}