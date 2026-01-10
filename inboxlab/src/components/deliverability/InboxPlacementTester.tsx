// /src/components/deliverability/InboxPlacementTester.tsx
"use client";

interface InboxPlacementTesterProps {
  test: {
    domain: string;
    timestamp: Date;
    inboxRate: number;
    spamRate: number;
    missingRate: number;
    score: number;
    status: 'good' | 'warning' | 'poor';
    ispResults: Array<{
      isp: string;
      placement: 'inbox' | 'spam' | 'missing';
      delay: number;
      reputation: number;
    }>;
  };
  onRunTest: () => void;
  loading: boolean;
}

export default function InboxPlacementTester({ test, onRunTest, loading }: InboxPlacementTesterProps) {
  const getPlacementColor = (placement: string) => {
    switch (placement) {
      case 'inbox': return 'text-green-600 bg-green-100';
      case 'spam': return 'text-red-600 bg-red-100';
      case 'missing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlacementIcon = (placement: string) => {
    switch (placement) {
      case 'inbox': return '✓';
      case 'spam': return '✗';
      case 'missing': return '?';
      default: return '○';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Inbox Placement Test</h2>
          <p className="text-gray-600">Results for {test.domain} tested on {new Date(test.timestamp).toLocaleString()}</p>
        </div>
        <button
          onClick={onRunTest}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run New Test'}
        </button>
      </div>

      {/* Overall Results */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Overall Results</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{test.inboxRate}%</div>
              <div className="text-sm text-gray-600 mt-2">Inbox Placement</div>
              <div className="text-xs text-green-500 mt-1">Goal: &gt; 90%</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{test.spamRate}%</div>
              <div className="text-sm text-gray-600 mt-2">Spam Placement</div>
              <div className="text-xs text-red-500 mt-1">Goal: &lt; 2%</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{test.missingRate}%</div>
              <div className="text-sm text-gray-600 mt-2">Missing</div>
              <div className="text-xs text-yellow-500 mt-1">Goal: &lt; 1%</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className={`text-3xl font-bold ${
                test.score >= 90 ? 'text-green-600' :
                test.score >= 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {test.score}/100
              </div>
              <div className="text-sm text-gray-600 mt-2">Deliverability Score</div>
              <div className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getStatusColor(test.status)}`}>
                {test.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ISP Results */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">ISP-by-ISP Results</h3>
          <p className="text-sm text-gray-600">How your emails perform across different email providers</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Email Provider</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Placement</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Delivery Delay</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Reputation</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {test.ispResults.map((isp, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{isp.isp}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPlacementColor(isp.placement)}`}>
                        {getPlacementIcon(isp.placement)} {isp.placement.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              isp.delay < 5 ? 'bg-green-500' :
                              isp.delay < 15 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (isp.delay / 30) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{isp.delay}s</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              isp.reputation >= 90 ? 'bg-green-500' :
                              isp.reputation >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${isp.reputation}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{isp.reputation}/100</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium ${
                        isp.placement === 'inbox' && isp.delay < 10 ? 'text-green-600' :
                        isp.placement === 'spam' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {isp.placement === 'inbox' && isp.delay < 10 ? 'Optimal' :
                         isp.placement === 'inbox' ? 'Good' :
                         isp.placement === 'spam' ? 'Needs Work' : 'Monitor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recommendations</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {test.score < 90 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <div className="text-yellow-600 mr-3">⚠</div>
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Improve Inbox Placement</h4>
                    <p className="text-sm text-yellow-800">
                      Your inbox rate is below 90%. Consider warming up your domain and improving email content.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {test.spamRate > 2 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <div className="text-red-600 mr-3">✗</div>
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">Reduce Spam Placement</h4>
                    <p className="text-sm text-red-800">
                      Spam rate is high. Check authentication records and avoid spam-triggering content.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {test.ispResults.some(isp => isp.placement === 'spam') && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3">🔧</div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">ISP-Specific Issues</h4>
                    <p className="text-sm text-blue-800">
                      {test.ispResults.filter(isp => isp.placement === 'spam').length} ISPs are marking emails as spam. Focus on these providers first.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <div className="text-green-600 mr-3">✓</div>
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Next Steps</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Test again after making changes</li>
                    <li>• Monitor daily for 7 days</li>
                    <li>• Compare with historical data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}