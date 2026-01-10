// /src/components/deliverability/SpamAnalysis.tsx
"use client";

import { useState } from 'react';

interface SpamAnalysisProps {
  spamTests: Array<{
    id: string;
    filterName: string;
    score: number;
    triggeredRules: string[];
    recommendations: string[];
  }>;
  onRunAnalysis: (emailContent: string) => void;
  loading: boolean;
}

export default function SpamAnalysis({ spamTests, onRunAnalysis, loading }: SpamAnalysisProps) {
  const [emailContent, setEmailContent] = useState(`Subject: Special Offer Just For You!

Hi [Name],

I hope this email finds you well! We're excited to offer you an exclusive 50% discount on our premium products.

Our customers love these features:
• Advanced analytics dashboard
• Team collaboration tools
• 24/7 customer support

Click here to claim your discount: https://example.com/special-offer

Best regards,
The Marketing Team

P.S. This offer expires in 48 hours, so don't miss out!`);
  
  const [selectedTest, setSelectedTest] = useState<string | null>(spamTests[0]?.id || null);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const selectedTestData = spamTests.find(test => test.id === selectedTest);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Spam Filter Analysis</h2>
        <p className="text-gray-600">Test your email content against common spam filters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Email Content</h3>
              <p className="text-sm text-gray-600">Paste or type your email content to test</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full h-64 font-mono text-sm p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Paste your email content here..."
                  spellCheck="false"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => onRunAnalysis(emailContent)}
                  disabled={loading || !emailContent.trim()}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Run Spam Analysis'}
                </button>
                <button
                  onClick={() => {
                    const sample = `Subject: Important Update

Dear Subscriber,

We've made some exciting updates to our service that we think you'll love.

What's new:
✓ Improved performance
✓ New features
✓ Better user experience

Learn more: https://example.com/updates

Thank you for being a valued customer!

Best,
The Team`;
                    setEmailContent(sample);
                  }}
                  className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Load Sample
                </button>
                <button
                  onClick={() => setEmailContent('')}
                  className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div>
          <div className="bg-white rounded-lg shadow border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Recent Analyses</h3>
            </div>
            <div className="p-0">
              <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                {spamTests.map(test => (
                  <button
                    key={test.id}
                    onClick={() => setSelectedTest(test.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 ${
                      selectedTest === test.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 truncate">
                        {test.filterName}
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded ${getScoreColor(test.score)}`}>
                        {test.score}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {test.triggeredRules.length > 0 
                        ? `${test.triggeredRules.length} rules triggered`
                        : 'No rules triggered'
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {selectedTestData && (
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedTestData.filterName}</h3>
                <p className="text-sm text-gray-600">Spam filter analysis results</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold px-3 py-1 rounded ${getScoreColor(selectedTestData.score)}`}>
                  {selectedTestData.score}/100
                </div>
                <div className="text-xs text-gray-600 mt-1">{getScoreLabel(selectedTestData.score)}</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Triggered Rules */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Triggered Rules</h4>
                {selectedTestData.triggeredRules.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTestData.triggeredRules.map((rule, index) => (
                      <div key={index} className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-red-600 text-sm font-bold">!</span>
                        </div>
                        <div>
                          <div className="font-medium text-red-900">{rule}</div>
                          <div className="text-sm text-red-700 mt-1">
                            This rule can trigger spam filters. Consider modifying your content.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <div className="text-green-600 text-4xl mb-3">✓</div>
                    <div className="font-medium text-green-900">No spam rules triggered!</div>
                    <div className="text-sm text-green-700 mt-1">
                      Your email content looks good to spam filters.
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Recommendations</h4>
                <div className="space-y-3">
                  {selectedTestData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-blue-600 text-sm font-bold">i</span>
                      </div>
                      <div>
                        <div className="font-medium text-blue-900">{recommendation}</div>
                        <div className="text-sm text-blue-700 mt-1">
                          Implementing this can improve your spam score.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Common Spam Triggers */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Common Spam Triggers to Avoid</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    trigger: 'Sales Language',
                    examples: ['Buy now', 'Limited time', 'Act fast'],
                    fix: 'Use conversational tone'
                  },
                  {
                    trigger: 'Suspicious Links',
                    examples: ['bit.ly', 'URL shorteners', 'IP addresses'],
                    fix: 'Use full, branded URLs'
                  },
                  {
                    trigger: 'Formatting',
                    examples: ['ALL CAPS', 'Excessive !!!', 'Bright colors'],
                    fix: 'Use normal formatting'
                  },
                  {
                    trigger: 'HTML Issues',
                    examples: ['No plain text', 'Large images', 'Broken code'],
                    fix: 'Include text version'
                  },
                  {
                    trigger: 'Content Ratio',
                    examples: ['Image heavy', 'Low text content', 'Sales keywords'],
                    fix: '60/40 text-to-image ratio'
                  },
                  {
                    trigger: 'Personalization',
                    examples: ['Generic greetings', 'No name', 'Mass email feel'],
                    fix: 'Use merge tags'
                  }
                ].map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-medium text-gray-900 mb-2">{item.trigger}</div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Examples:</span> {item.examples.join(', ')}
                    </div>
                    <div className="text-sm text-blue-600">
                      <span className="font-medium">Fix:</span> {item.fix}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Quick Tips to Avoid Spam Filters</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Authentication',
                tip: 'Always use SPF, DKIM, and DMARC',
                importance: 'Critical'
              },
              {
                title: 'Content Balance',
                tip: 'Maintain 60% text, 40% images',
                importance: 'High'
              },
              {
                title: 'Link Safety',
                tip: 'Use branded, full-length URLs',
                importance: 'High'
              },
              {
                title: 'Language',
                tip: 'Avoid aggressive sales language',
                importance: 'Medium'
              },
              {
                title: 'Formatting',
                tip: 'No excessive punctuation or caps',
                importance: 'Medium'
              },
              {
                title: 'Personalization',
                tip: 'Use recipient names when possible',
                importance: 'Medium'
              },
              {
                title: 'Testing',
                tip: 'Test before sending to entire list',
                importance: 'High'
              },
              {
                title: 'List Hygiene',
                tip: 'Remove inactive subscribers regularly',
                importance: 'Critical'
              }
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    item.importance === 'Critical' ? 'bg-red-100 text-red-800' :
                    item.importance === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.importance}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{item.tip}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}