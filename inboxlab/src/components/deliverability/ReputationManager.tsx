// /src/components/deliverability/ReputationManager.tsx
"use client";

interface ReputationManagerProps {
  domainReputations: Array<{
    domain: string;
    score: number;
    lastUpdated: Date;
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
    blacklists: string[];
    volume: number;
    bounceRate: number;
    complaintRate: number;
  }>;
  onFixIssue: (domain: string, issue: 'spf' | 'dkim' | 'dmarc') => void;
}

export default function ReputationManager({ domainReputations, onFixIssue }: ReputationManagerProps) {
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

  const getBounceColor = (rate: number) => {
    if (rate < 1) return 'text-green-600';
    if (rate < 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplaintColor = (rate: number) => {
    if (rate < 0.05) return 'text-green-600';
    if (rate < 0.1) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Domain Reputation Manager</h2>
        <p className="text-gray-600">Monitor and improve your domain's email sending reputation</p>
      </div>

      {/* Reputation Overview */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Domain Reputation Scores</h3>
          <p className="text-sm text-gray-600">Higher scores mean better deliverability</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainReputations.map(domain => (
              <div key={domain.domain} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{domain.domain}</h4>
                    <p className="text-sm text-gray-600">
                      Updated {new Date(domain.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold px-3 py-1 rounded ${getScoreColor(domain.score)}`}>
                      {domain.score}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{getScoreLabel(domain.score)}</div>
                  </div>
                </div>

                {/* Authentication Status */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Authentication</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => !domain.spf && onFixIssue(domain.domain, 'spf')}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                        domain.spf ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <span className={`text-sm font-medium ${domain.spf ? 'text-green-700' : 'text-red-700'}`}>
                        SPF
                      </span>
                      <span className="text-2xl">{domain.spf ? '✓' : '✗'}</span>
                      {!domain.spf && (
                        <span className="text-xs text-red-600 mt-1 hover:underline">Fix</span>
                      )}
                    </button>
                    <button
                      onClick={() => !domain.dkim && onFixIssue(domain.domain, 'dkim')}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                        domain.dkim ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <span className={`text-sm font-medium ${domain.dkim ? 'text-green-700' : 'text-red-700'}`}>
                        DKIM
                      </span>
                      <span className="text-2xl">{domain.dkim ? '✓' : '✗'}</span>
                      {!domain.dkim && (
                        <span className="text-xs text-red-600 mt-1 hover:underline">Fix</span>
                      )}
                    </button>
                    <button
                      onClick={() => !domain.dmarc && onFixIssue(domain.domain, 'dmarc')}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                        domain.dmarc ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <span className={`text-sm font-medium ${domain.dmarc ? 'text-green-700' : 'text-red-700'}`}>
                        DMARC
                      </span>
                      <span className="text-2xl">{domain.dmarc ? '✓' : '✗'}</span>
                      {!domain.dmarc && (
                        <span className="text-xs text-red-600 mt-1 hover:underline">Fix</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Daily Volume</span>
                      <span className="font-medium text-gray-900">{domain.volume.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${Math.min(100, (domain.volume / 100000) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Bounce Rate</span>
                      <span className={`font-medium ${getBounceColor(domain.bounceRate)}`}>
                        {domain.bounceRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getBounceColor(domain.bounceRate).replace('text-', 'bg-')}`}
                        style={{ width: `${Math.min(100, domain.bounceRate * 20)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Complaint Rate</span>
                      <span className={`font-medium ${getComplaintColor(domain.complaintRate)}`}>
                        {domain.complaintRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getComplaintColor(domain.complaintRate).replace('text-', 'bg-')}`}
                        style={{ width: `${Math.min(100, domain.complaintRate * 1000)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Blacklists */}
                {domain.blacklists.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-red-700 mb-2">Blacklisted On</div>
                    <div className="flex flex-wrap gap-1">
                      {domain.blacklists.map((blacklist, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          {blacklist}
                        </span>
                      ))}
                    </div>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                      Request removal →
                    </button>
                  </div>
                )}

                {/* Recommendations */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-2">Recommendations</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {domain.score < 90 && (
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-1">•</span>
                        Improve authentication setup
                      </li>
                    )}
                    {domain.bounceRate > 2 && (
                      <li className="flex items-start">
                        <span className="text-red-500 mr-1">•</span>
                        Clean email list to reduce bounces
                      </li>
                    )}
                    {domain.complaintRate > 0.1 && (
                      <li className="flex items-start">
                        <span className="text-red-500 mr-1">•</span>
                        Review email content and frequency
                      </li>
                    )}
                    {domain.blacklists.length > 0 && (
                      <li className="flex items-start">
                        <span className="text-red-500 mr-1">•</span>
                        Request removal from blacklists
                      </li>
                    )}
                    {domain.score >= 90 && (
                      <li className="flex items-start">
                        <span className="text-green-500 mr-1">•</span>
                        Maintain current practices
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reputation Factors */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Reputation Factors</h3>
          <p className="text-sm text-gray-600">What impacts your domain reputation score</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Authentication',
                description: 'SPF, DKIM, and DMARC setup',
                weight: '30%',
                tips: ['Always use all three', 'Keep records updated', 'Monitor for failures']
              },
              {
                title: 'Engagement',
                description: 'Open rates, click rates',
                weight: '25%',
                tips: ['Segment your lists', 'Send relevant content', 'Optimize send times']
              },
              {
                title: 'Complaints',
                description: 'User spam reports',
                weight: '20%',
                tips: ['Clear unsubscribe process', 'Honor preferences quickly', 'Monitor complaint rates']
              },
              {
                title: 'Bounce Rate',
                description: 'Failed deliveries',
                weight: '15%',
                tips: ['Clean lists regularly', 'Use double opt-in', 'Remove hard bounces immediately']
              }
            ].map((factor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{factor.title}</h4>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {factor.weight}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <div className="font-medium mb-1">Tips:</div>
                  <ul className="space-y-1">
                    {factor.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <span className="text-blue-500 mr-1">•</span>
                        <span className="text-xs">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}