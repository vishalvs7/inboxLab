"use client";

interface Subscriber {
  id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  dateAdded: Date;
  lastContact: Date;
  source: 'import' | 'form' | 'api';
  tags: string[];
}

interface BounceDetectorProps {
  subscribers: Subscriber[];
  onDetectBounces: () => void;
}

export default function BounceDetector({ subscribers, onDetectBounces }: BounceDetectorProps) {
  const recentBounces = subscribers
    .filter(s => s.status === 'bounced')
    .sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
    .slice(0, 5);

  const bouncePatterns = [
    { pattern: 'Mailbox full', count: 3 },
    { pattern: 'Domain not found', count: 2 },
    { pattern: 'User unknown', count: 5 },
    { pattern: 'Message rejected', count: 1 },
  ];

  const getBounceStats = () => {
    const total = subscribers.length;
    const bounced = subscribers.filter(s => s.status === 'bounced').length;
    const bounceRate = total > 0 ? (bounced / total) * 100 : 0;
    
    const recentActivity = subscribers
      .filter(s => s.status === 'bounced')
      .filter(s => {
        const bounceDate = new Date(s.lastContact);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return bounceDate > thirtyDaysAgo;
      }).length;

    return {
      totalBounced: bounced,
      bounceRate: bounceRate.toFixed(1),
      recentBounces: recentActivity,
      trend: recentActivity > bounced / 3 ? 'increasing' : 'stable'
    };
  };

  const stats = getBounceStats();

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Bounce Detection</h3>
        <button
          onClick={onDetectBounces}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Detect New Bounces
        </button>
      </div>

      {/* Bounce Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.totalBounced}</div>
          <div className="text-sm text-red-700">Total Bounces</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.bounceRate}%</div>
          <div className="text-sm text-orange-700">Bounce Rate</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.recentBounces}</div>
          <div className="text-sm text-yellow-700">Last 30 Days</div>
        </div>
      </div>

      {/* Recent Bounces */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Bounces</h4>
        <div className="space-y-2">
          {recentBounces.map((bounce) => (
            <div key={bounce.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 font-bold">↩</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{bounce.email}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(bounce.lastContact).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                Hard Bounce
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bounce Patterns */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Common Bounce Patterns</h4>
        <div className="space-y-3">
          {bouncePatterns.map((pattern, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-900">{pattern.pattern}</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${(pattern.count / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{pattern.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Recommendation:</span> Keep bounce rate under 2% for optimal deliverability. 
              Consider cleaning your list if bounce rate exceeds 5%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
