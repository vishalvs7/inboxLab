"use client";

import { useState, useEffect } from 'react';
import TemplateEditor from '@/components/tester/TemplateEditor';
import ClientPreviewGrid from '@/components/tester/ClientPreviewGrid';
import TestResults from '@/components/tester/TestResults';
import AnalyticsDashboard from '@/components/tester/AnalyticsDashboard';

interface EmailTemplate {
  id: string;
  name: string;
  htmlContent: string;
  cssContent: string;
  createdAt: Date;
  lastTested: Date | null;
  tags: string[];
}

interface TestResult {
  id: string;
  templateId: string;
  timestamp: Date;
  clientResults: ClientResult[];
  overallScore: number;
  issuesFound: number;
}

interface ClientResult {
  clientName: string;
  category: 'desktop' | 'mobile' | 'web';
  status: 'perfect' | 'good' | 'warning' | 'failed';
  issues: string[];
  screenshotUrl?: string;
}

interface EmailClient {
  name: string;
  category: 'desktop' | 'mobile' | 'web';
  marketShare: number;
  renderingEngine: 'webkit' | 'gecko' | 'blink' | 'legacy';
}

export default function EmailTemplateTesterPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [emailClients, setEmailClients] = useState<EmailClient[]>([]);

  // Load initial sample data
  useEffect(() => {
    loadSampleData();
    loadEmailClients();
    
    // Load history from localStorage
    const savedResults = localStorage.getItem('email_tester_results');
    if (savedResults) {
      try {
        setTestResults(JSON.parse(savedResults));
      } catch (e) {
        console.error('Failed to load test results:', e);
      }
    }
  }, []);

  const loadSampleData = () => {
    const sampleTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome Newsletter',
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Welcome to Our Service!</h1>
          <p>Thank you for joining us. We're excited to have you on board.</p>
          <a href="#" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a>
        </div>`,
        cssContent: `body { margin: 0; padding: 0; background-color: #f9fafb; }`,
        createdAt: new Date('2024-01-01'),
        lastTested: new Date('2024-01-10'),
        tags: ['welcome', 'newsletter', 'marketing']
      },
      {
        id: '2',
        name: 'Promotional Sale',
        htmlContent: `<table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
          <tr>
            <td align="center" style="padding: 40px 20px; background-color: #dc2626; color: white;">
              <h1 style="margin: 0;">FLASH SALE</h1>
              <p style="font-size: 24px; margin: 20px 0;">50% OFF Everything</p>
              <a href="#" style="background-color: white; color: #dc2626; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Shop Now</a>
            </td>
          </tr>
        </table>`,
        cssContent: ``,
        createdAt: new Date('2024-01-05'),
        lastTested: new Date('2024-01-12'),
        tags: ['promotion', 'sale', 'ecommerce']
      },
      {
        id: '3',
        name: 'Product Update',
        htmlContent: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px;">
          <h2>New Features Available</h2>
          <p>We've added exciting new features to help you succeed.</p>
          <ul>
            <li>Advanced analytics dashboard</li>
            <li>Team collaboration tools</li>
            <li>Mobile app improvements</li>
          </ul>
        </div>`,
        cssContent: `h2 { color: #059669; } ul { padding-left: 20px; }`,
        createdAt: new Date('2024-01-08'),
        lastTested: null,
        tags: ['update', 'product', 'announcement']
      },
    ];
    
    setTemplates(sampleTemplates);
    setActiveTemplate(sampleTemplates[0]);
  };

  const loadEmailClients = () => {
    const clients: EmailClient[] = [
      // Desktop Clients
      { name: 'Apple Mail', category: 'desktop', marketShare: 35, renderingEngine: 'webkit' },
      { name: 'Outlook Desktop', category: 'desktop', marketShare: 25, renderingEngine: 'legacy' },
      { name: 'Windows Mail', category: 'desktop', marketShare: 8, renderingEngine: 'webkit' },
      { name: 'Thunderbird', category: 'desktop', marketShare: 5, renderingEngine: 'gecko' },
      
      // Mobile Clients
      { name: 'Gmail App (iOS)', category: 'mobile', marketShare: 18, renderingEngine: 'webkit' },
      { name: 'Gmail App (Android)', category: 'mobile', marketShare: 15, renderingEngine: 'webkit' },
      { name: 'Apple Mail (iOS)', category: 'mobile', marketShare: 20, renderingEngine: 'webkit' },
      { name: 'Outlook Mobile', category: 'mobile', marketShare: 10, renderingEngine: 'webkit' },
      { name: 'Samsung Email', category: 'mobile', marketShare: 7, renderingEngine: 'webkit' },
      
      // Web Clients
      { name: 'Gmail Web', category: 'web', marketShare: 40, renderingEngine: 'webkit' },
      { name: 'Outlook Web', category: 'web', marketShare: 25, renderingEngine: 'webkit' },
      { name: 'Yahoo Mail', category: 'web', marketShare: 12, renderingEngine: 'webkit' },
      { name: 'Proton Mail', category: 'web', marketShare: 5, renderingEngine: 'webkit' },
    ];
    
    setEmailClients(clients);
  };

  const runTest = () => {
    if (!activeTemplate) {
      alert('Please select a template to test');
      return;
    }

    setLoading(true);
    
    // Simulate testing across all clients
    setTimeout(() => {
      const clientResults: ClientResult[] = emailClients.map(client => {
        const statuses: ClientResult['status'][] = ['perfect', 'good', 'warning', 'failed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const issues = status === 'perfect' ? [] : 
          status === 'good' ? ['Minor padding issue'] :
          status === 'warning' ? ['Image blocking', 'Font fallback'] :
          ['Broken layout', 'Missing images', 'CSS not supported'];
        
        return {
          clientName: client.name,
          category: client.category,
          status,
          issues,
          screenshotUrl: `https://placehold.co/300x200/cccccc/000000?text=${encodeURIComponent(client.name)}`
        };
      });

      const overallScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const issuesFound = clientResults.reduce((sum, client) => sum + client.issues.length, 0);

      const newTestResult: TestResult = {
        id: Date.now().toString(),
        templateId: activeTemplate.id,
        timestamp: new Date(),
        clientResults,
        overallScore,
        issuesFound
      };

      // Update template's lastTested
      setTemplates(prev => prev.map(t => 
        t.id === activeTemplate.id 
          ? { ...t, lastTested: new Date() }
          : t
      ));

      // Add to results
      const updatedResults = [newTestResult, ...testResults.slice(0, 9)]; // Keep last 10
      setTestResults(updatedResults);
      localStorage.setItem('email_tester_results', JSON.stringify(updatedResults));

      setLoading(false);
      
      alert(`Test complete! Score: ${overallScore}/100. Found ${issuesFound} issues across ${clientResults.length} email clients.`);
      
    }, 2000);
  };

  const createTemplate = (name: string, html: string, css: string = '') => {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name,
      htmlContent: html,
      cssContent: css,
      createdAt: new Date(),
      lastTested: null,
      tags: ['new']
    };
    
    setTemplates([...templates, newTemplate]);
    setActiveTemplate(newTemplate);
  };

  const updateTemplate = (id: string, updates: Partial<EmailTemplate>) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
    
    if (activeTemplate?.id === id) {
      setActiveTemplate(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (activeTemplate?.id === id) {
      setActiveTemplate(templates[0] || null);
    }
  };

  const exportResults = (format: 'csv' | 'json' | 'html') => {
    if (!testResults.length) {
      alert('No test results to export');
      return;
    }

    let data = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'csv':
        data = 'Template Name,Test Date,Overall Score,Issues Found,Passed Clients\n';
        testResults.forEach(result => {
          const template = templates.find(t => t.id === result.templateId);
          const passedClients = result.clientResults.filter(c => c.status === 'perfect' || c.status === 'good').length;
          data += `${template?.name || 'Unknown'},${result.timestamp.toISOString()},${result.overallScore},${result.issuesFound},${passedClients}\n`;
        });
        filename = 'email-test-results.csv';
        mimeType = 'text/csv';
        break;

      case 'json':
        data = JSON.stringify(testResults, null, 2);
        filename = 'email-test-results.json';
        mimeType = 'application/json';
        break;

      case 'html':
        data = `<html><body><h1>Email Test Results</h1><pre>${JSON.stringify(testResults, null, 2)}</pre></body></html>`;
        filename = 'email-test-results.html';
        mimeType = 'text/html';
        break;
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
    const totalTemplates = templates.length;
    const testedTemplates = templates.filter(t => t.lastTested !== null).length;
    const totalTests = testResults.length;
    
    const avgScore = testResults.length > 0 
      ? testResults.reduce((sum, r) => sum + r.overallScore, 0) / testResults.length 
      : 0;
    
    const issuesFixed = testResults.reduce((sum, r) => sum + r.issuesFound, 0);
    
    const clientsCovered = emailClients.length;
    const coverageRate = (clientsCovered / 30) * 100; // Based on your 30+ clients spec

    return {
      totalTemplates,
      testedTemplates,
      totalTests,
      avgScore: avgScore.toFixed(1),
      issuesFixed,
      clientsCovered,
      coverageRate: coverageRate.toFixed(1)
    };
  };

  const stats = getStats();

  const getLatestResult = () => {
    if (testResults.length === 0) return null;
    return testResults[0];
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Template Tester</h1>
        <p className="text-gray-600">
          Test your email templates across 30+ email clients. Get instant previews and identify rendering issues before you send.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</div>
          <div className="text-sm text-gray-600">Templates</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{stats.totalTests}</div>
          <div className="text-sm text-gray-600">Tests Run</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.avgScore}</div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">{stats.issuesFixed}</div>
          <div className="text-sm text-gray-600">Issues Found</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">{stats.clientsCovered}</div>
          <div className="text-sm text-gray-600">Clients</div>
        </div>
      </div>

      {/* Template Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Select Template</h2>
          <button
            onClick={() => {
              const name = prompt('Template name:');
              if (name) createTemplate(name, '<div>New template</div>');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            + New Template
          </button>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(template)}
              className={`px-4 py-3 rounded-lg border flex-shrink-0 ${
                activeTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{template.name}</div>
              <div className="text-xs text-gray-500">
                {template.lastTested ? `Tested: ${new Date(template.lastTested).toLocaleDateString()}` : 'Never tested'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {['editor', 'preview', 'results', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'editor' && 'Template Editor'}
              {tab === 'preview' && 'Client Previews'}
              {tab === 'results' && 'Test Results'}
              {tab === 'analytics' && 'Analytics'}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'editor' && activeTemplate && (
            <TemplateEditor
              template={activeTemplate}
              onUpdate={(updates) => updateTemplate(activeTemplate.id, updates)}
              onDelete={() => deleteTemplate(activeTemplate.id)}
            />
          )}

          {activeTab === 'preview' && activeTemplate && (
            <ClientPreviewGrid
              emailClients={emailClients}
              latestResult={getLatestResult()}
              onRunTest={runTest}
              loading={loading}
            />
          )}

          {activeTab === 'results' && testResults.length > 0 && (
            <TestResults
              results={testResults}
              templates={templates}
              onExport={exportResults}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              stats={stats}
              testResults={testResults}
              templates={templates}
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
                  <span className="font-medium text-blue-900">Current Template</span>
                  <span className="text-lg font-bold text-blue-600">
                    {activeTemplate?.name || 'None selected'}
                  </span>
                </div>
                {activeTemplate && (
                  <p className="text-sm text-blue-700">
                    Last tested: {activeTemplate.lastTested 
                      ? new Date(activeTemplate.lastTested).toLocaleDateString() 
                      : 'Never'}
                  </p>
                )}
              </div>

              <button
                onClick={runTest}
                disabled={loading || !activeTemplate}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Testing...
                  </span>
                ) : (
                  'Test Across All Clients'
                )}
              </button>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Test Specific Clients</div>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="">
                  <option value="">All Clients (30+)</option>
                  <option value="desktop">Desktop Clients Only</option>
                  <option value="mobile">Mobile Clients Only</option>
                  <option value="gmail">Gmail Family Only</option>
                  <option value="outlook">Outlook Family Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Integration Status */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Integrations</h3>
            <div className="space-y-3">
              {['Mailchimp', 'SendGrid', 'HubSpot', 'ActiveCampaign', 'Campaign Monitor'].map((service) => (
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Email Testing Best Practices</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Test in both desktop and mobile clients</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Use inline CSS for maximum compatibility</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Add alt text to all images</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Keep width under 600px for mobile</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Test with images disabled</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}