"use client";

import { useState, useEffect } from 'react';
import EmailValidator from '@/components/compliance/EmailValidator';
import ValidationResults from '@/components/compliance/ValidationResults';
import ComplianceChecklist from '@/components/compliance/ComplianceChecklist';
import ValidationHistory from '@/components/compliance/ValidationHistory';

interface ValidationResult {
  id: string;
  timestamp: Date;
  spamScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  issues: string[];
  suggestions: string[];
  compliance: {
    canSpam: boolean;
    gdpr: boolean;
    unsubscribe: boolean;
  };
  emailPreview: string;
}

export default function ComplianceToolPage() {
  const [emailContent, setEmailContent] = useState('');
  const [results, setResults] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ValidationResult[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('cold_email_validations');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load validation history:', e);
      }
    }
  }, []);

  const validateEmail = async () => {
    if (!emailContent.trim()) {
      alert('Please enter email content to validate');
      return;
    }

    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate mock validation results
      const spamScore = Math.floor(Math.random() * 100);
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      
      if (spamScore > 70) riskLevel = 'high';
      else if (spamScore > 40) riskLevel = 'medium';

      // Generate issues based on spam score
      const issues = [];
      if (spamScore > 60) {
        issues.push('Too many sales-oriented words');
        issues.push('Excessive use of exclamation marks');
        issues.push('Missing physical address');
      }
      if (spamScore > 30) {
        issues.push('Could improve subject line');
        issues.push('Consider adding more personalization');
      }

      // Generate suggestions
      const suggestions = [
        'Add recipient name for personalization',
        'Include clear unsubscribe link',
        'Add physical mailing address',
        'Avoid ALL CAPS in subject',
        'Test with different subject lines'
      ];

      const newResult: ValidationResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        spamScore,
        riskLevel,
        issues,
        suggestions,
        compliance: {
          canSpam: spamScore < 60,
          gdpr: spamScore < 70,
          unsubscribe: true
        },
        emailPreview: emailContent.substring(0, 100) + '...'
      };

      setResults(newResult);
      
      // Add to history
      const updatedHistory = [newResult, ...history.slice(0, 9)]; // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('cold_email_validations', JSON.stringify(updatedHistory));
      
      setLoading(false);
    }, 1000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cold_email_validations');
  };

  const loadFromHistory = (result: ValidationResult) => {
    setResults(result);
  };

  const sampleEmails = [
    {
      title: 'Sales Outreach',
      content: `Subject: Quick question about your business

Hi [Name],

I noticed you're in the [Industry] space and wanted to reach out. Our platform helps companies like yours increase efficiency by 40%.

Would you be open to a 15-minute call next week to discuss?

Best,
[Your Name]`
    },
    {
      title: 'Partnership Proposal',
      content: `Subject: Partnership opportunity with [Their Company]

Dear [Name],

I'm reaching out from [Your Company]. We've been following your work in [Field] and are impressed with what you've built.

We believe there's a great opportunity for collaboration that could benefit both our audiences.

Looking forward to your thoughts.

Sincerely,
[Your Name]`
    },
    {
      title: 'Newsletter Invitation',
      content: `Subject: Join our community of [Industry] professionals

Hello [Name],

We're launching a weekly newsletter with insights and trends in [Industry]. Each issue includes:
- Industry analysis
- Expert interviews
- Tool recommendations
- Growth strategies

Would you like to join? You can unsubscribe anytime.

Cheers,
[Your Name]`
    }
  ];

  const loadSample = (content: string) => {
    setEmailContent(content);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cold Email Validator</h1>
        <p className="text-gray-600">
          Check your cold emails for spam triggers and compliance issues before sending. Avoid blacklists and improve deliverability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Email Input & Results */}
        <div className="lg:col-span-2 space-y-8">
          <EmailValidator
            emailContent={emailContent}
            setEmailContent={setEmailContent}
            onValidate={validateEmail}
            loading={loading}
            onLoadSample={loadSample}
            sampleEmails={sampleEmails}
          />

          {results && (
            <ValidationResults results={results} />
          )}

          <ValidationHistory
            history={history}
            onLoad={loadFromHistory}
            onClear={clearHistory}
          />
        </div>

        {/* Right Column - Compliance Checklist */}
        <div className="space-y-6">
          <ComplianceChecklist />

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Validation Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Total Validations</span>
                  <span className="font-medium">{history.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(history.length * 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {history.filter(h => h.riskLevel === 'low').length}
                  </div>
                  <div className="text-xs text-gray-600">Low Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {history.filter(h => h.riskLevel === 'high').length}
                  </div>
                  <div className="text-xs text-gray-600">High Risk</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span>Average Spam Score</span>
                    <span className="font-medium">
                      {history.length > 0 
                        ? Math.round(history.reduce((sum, h) => sum + h.spamScore, 0) / history.length)
                        : 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ 
                        width: `${history.length > 0 
                          ? Math.round(history.reduce((sum, h) => sum + h.spamScore, 0) / history.length)
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Best Practices</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Personalize with recipient name</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Include clear unsubscribe link</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Add physical mailing address</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Avoid excessive punctuation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Test subject lines before sending</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}