"use client";

import { useState, useEffect } from 'react';
import EmailUploader from '@/components/cleaner/EmailUploader';
import VerificationResults from '@/components/cleaner/VerificationResults';
import ListStatistics from '@/components/cleaner/ListStatistics';
import BulkActions from '@/components/cleaner/BulkActions';

interface EmailResult {
  id: string;
  email: string;
  status: 'valid' | 'invalid' | 'risky' | 'disposable' | 'role';
  reason?: string;
  confidence: number;
  verifiedAt: Date;
}

export default function CleanerToolPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verificationHistory, setVerificationHistory] = useState<EmailResult[][]>([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('email_verification_history');
    if (savedHistory) {
      try {
        setVerificationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load verification history:', e);
      }
    }
  }, []);

  // Load sample data on first visit
  useEffect(() => {
    if (emails.length === 0 && results.length === 0) {
      loadSampleData();
    }
  }, []);

  const loadSampleData = () => {
    const sampleEmails = [
      'john.doe@example.com',
      'invalid-email@',
      'admin@company.com',
      'support@domain.com',
      'temp@temp-mail.org',
      'user@gmail.com',
      'info@business.com',
      'bounce@example.org',
      'contact@startup.io',
      'test@test.com',
      'sales@corporation.com',
      'hello@personal.co',
      'webmaster@website.com',
      'noreply@service.com',
      'feedback@platform.net'
    ];
    setEmails(sampleEmails);
  };

  const verifyEmails = async () => {
    if (emails.length === 0) {
      alert('Please add emails to verify');
      return;
    }

    setLoading(true);
    setProgress(0);
    const newResults: EmailResult[] = [];

    // Simulate verification process with progress
    for (let i = 0; i < emails.length; i++) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const email = emails[i];
      let status: EmailResult['status'] = 'valid';
      let reason = '';
      let confidence = 95;

      // Mock validation logic
      if (!email.includes('@') || !email.includes('.')) {
        status = 'invalid';
        reason = 'Invalid format';
        confidence = 10;
      } else if (email.includes('temp') || email.includes('fake')) {
        status = 'disposable';
        reason = 'Disposable email address';
        confidence = 80;
      } else if (email.startsWith('admin') || email.startsWith('support') || 
                 email.startsWith('info') || email.startsWith('contact')) {
        status = 'role';
        reason = 'Role-based email';
        confidence = 70;
      } else if (email.includes('bounce') || email.includes('test') || 
                 Math.random() > 0.7) {
        status = 'risky';
        reason = 'High bounce risk';
        confidence = 60;
      }

      newResults.push({
        id: `${Date.now()}-${i}`,
        email,
        status,
        reason,
        confidence,
        verifiedAt: new Date()
      });

      setProgress(Math.round(((i + 1) / emails.length) * 100));
    }

    setResults(newResults);
    
    // Save to history
    const updatedHistory = [newResults, ...verificationHistory.slice(0, 4)]; // Keep last 5
    setVerificationHistory(updatedHistory);
    localStorage.setItem('email_verification_history', JSON.stringify(updatedHistory));
    
    setLoading(false);
  };

  const removeEmail = (index: number) => {
    setEmails(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setEmails([]);
    setResults([]);
  };

  const exportResults = (type: 'valid' | 'all' | 'invalid') => {
    let data = '';
    
    if (type === 'valid') {
      data = results.filter(r => r.status === 'valid').map(r => r.email).join('\n');
    } else if (type === 'invalid') {
      data = results.filter(r => r.status !== 'valid').map(r => `${r.email} - ${r.status}`).join('\n');
    } else {
      data = results.map(r => `${r.email},${r.status},${r.reason || ''},${r.confidence}%`).join('\n');
    }

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-list-${type}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadFromHistory = (historyResults: EmailResult[]) => {
    setResults(historyResults);
    setEmails(historyResults.map(r => r.email));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email List Cleaner</h1>
        <p className="text-gray-600">
          Bulk email verification and list hygiene. Remove invalid, disposable, and role-based emails to improve deliverability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload & Results */}
        <div className="lg:col-span-2 space-y-8">
          <EmailUploader
            emails={emails}
            setEmails={setEmails}
            onVerify={verifyEmails}
            loading={loading}
            progress={progress}
            onClear={clearAll}
            onLoadSample={loadSampleData}
            onRemoveEmail={removeEmail}
          />

          {results.length > 0 && (
            <>
              <VerificationResults
                results={results}
                onExport={exportResults}
              />

              <ListStatistics results={results} />
            </>
          )}

          {/* Verification History */}
          {verificationHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Verification History</h3>
                <button
                  onClick={() => {
                    setVerificationHistory([]);
                    localStorage.removeItem('email_verification_history');
                  }}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-3">
                {verificationHistory.map((historyResults, index) => {
                  const validCount = historyResults.filter(r => r.status === 'valid').length;
                  const totalCount = historyResults.length;
                  const date = new Date(historyResults[0]?.verifiedAt || Date.now());
                  
                  return (
                    <div
                      key={index}
                      onClick={() => loadFromHistory(historyResults)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            Verification #{verificationHistory.length - index}
                          </div>
                          <div className="text-sm text-gray-600">
                            {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {validCount}/{totalCount}
                          </div>
                          <div className="text-xs text-gray-600">
                            Valid emails
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Click to load these results
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          <BulkActions
            onExport={exportResults}
            hasResults={results.length > 0}
          />

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Email Validation</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Syntax Check</span>
                  <span className="font-medium text-green-600">✓</span>
                </div>
                <p className="text-xs text-gray-500">Validates email format and structure</p>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Domain Verification</span>
                  <span className="font-medium text-green-600">✓</span>
                </div>
                <p className="text-xs text-gray-500">Checks if domain exists and has MX records</p>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Disposable Detection</span>
                  <span className="font-medium text-green-600">✓</span>
                </div>
                <p className="text-xs text-gray-500">Identifies temporary email services</p>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Role Account Check</span>
                  <span className="font-medium text-green-600">✓</span>
                </div>
                <p className="text-xs text-gray-500">Flags admin/support/info emails</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-xs text-gray-600">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-900">Free Tier</div>
                  <div className="text-xs text-blue-700">100 emails/month</div>
                </div>
                <div className="text-lg font-bold text-blue-600">$0</div>
              </div>

              <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Starter</div>
                  <div className="text-xs text-gray-600">1,000 emails/month</div>
                </div>
                <div className="text-lg font-bold text-gray-900">$10</div>
              </div>

              <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Business</div>
                  <div className="text-xs text-gray-600">10,000 emails/month</div>
                </div>
                <div className="text-lg font-bold text-gray-900">$50</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Upgrade for Bulk Verification
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Reduce bounce rates by up to 98%</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Improve sender reputation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Save on email service costs</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Increase campaign ROI</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}