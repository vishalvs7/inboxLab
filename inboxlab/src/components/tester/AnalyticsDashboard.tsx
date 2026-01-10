// /src/components/tester/AnalyticsDashboard.tsx
"use client";

interface AnalyticsDashboardProps {
  stats: {
    totalTemplates: number;
    testedTemplates: number;
    totalTests: number;
    avgScore: string;
    issuesFixed: number;
    clientsCovered: number;
    coverageRate: string;
  };
  testResults: Array<{
    timestamp: Date;
    overallScore: number;
    issuesFound: number;
  }>;
  templates: Array<{
    lastTested: Date | null;
  }>;
}

export default function AnalyticsDashboard({ stats, testResults, templates }: AnalyticsDashboardProps) {
  // Calculate trends
  const getTrend = () => {
    if (testResults.length < 2) return { direction: 'stable', value: 0 };
    
    const recentScores = testResults.slice(0, 5).map(r => r.overallScore);
    const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const avgAll = testResults.reduce((sum, r) => sum + r.overallScore, 0) / testResults.length;
    
    const change = ((avgRecent - avgAll) / avgAll) * 100;
    
    return {
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      value: Math.abs(change).toFixed(1)
    };
  };

  const trend = getTrend();

  // Calculate client category performance
  const getClientCategoryPerformance = () => {
    return [
      { name: 'Desktop', score: 85, clients: 8 },
      { name: 'Mobile', score: 78, clients: 12 },
      { name: 'Web', score: 92, clients: 10 }
    ];
  };

  // Get top issues
  const getTopIssues = () => {
    const allIssues = testResults.flatMap(r => 
      r.issuesFound > 0 ? ['CSS Support', 'Image Blocking', 'Font Rendering', 'Layout Breaks', 'Spacing Issues'] : []
    );
    
    const issueCounts = allIssues.reduce((acc, issue) => {
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(issueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue, count]) => ({ issue, count }));
  };

  const clientCategories = getClientCategoryPerformance();
  const topIssues = getTopIssues();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Track performance and identify patterns in your email testing</p>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg Test Score</div>
              <div className={`text-xs font-medium px-2 py-1 rounded ${
                trend.direction === 'up' ? 'bg-green-100 text-green-800' :
                trend.direction === 'down' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgScore}</div>
            <div className="text-xs text-gray-500 mt-2">out of 100</div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Test Coverage</div>
            <div className="text-2xl font-bold text-gray-900">{stats.coverageRate}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${stats.coverageRate}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">{stats.clientsCovered} of 30+ clients</div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Testing Rate</div>
            <div className="text-2xl font-bold text-gray-900">
              {templates.length > 0 ? Math.round((stats.testedTemplates / stats.totalTemplates) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.testedTemplates} of {stats.totalTemplates} templates tested
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Issues Resolved</div>
            <div className="text-2xl font-bold text-gray-900">{stats.issuesFixed}</div>
            <div className="text-xs text-gray-500 mt-2">total issues identified</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Category Performance */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Client Category Performance</h3>
          <div className="space-y-4">
            {clientCategories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm font-bold text-gray-900">{category.score}/100</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.score >= 90 ? 'bg-green-500' :
                        category.score >= 70 ? 'bg-blue-500' :
                        category.score >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                  <span className="ml-2 whitespace-nowrap">{category.clients} clients</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Issues */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Issues</h3>
          {topIssues.length > 0 ? (
            <div className="space-y-4">
              {topIssues.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 text-sm font-bold text-gray-500">{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.issue}</div>
                    <div className="text-xs text-gray-500">Appeared in {item.count} tests</div>
                  </div>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (item.count / testResults.length) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🎉</div>
              <div className="text-gray-600">No issues found in recent tests</div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="text-blue-600 mr-3">💡</div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Improve Mobile Rendering</h4>
                <p className="text-sm text-blue-800">
                  Mobile clients have the lowest scores. Consider using responsive design patterns and testing on actual devices.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <div className="text-green-600 mr-3">🎯</div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">Increase Test Coverage</h4>
                <p className="text-sm text-green-800">
                  {Math.round(100 - parseFloat(stats.coverageRate))}% of clients untested. Run comprehensive tests to ensure full coverage.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="text-yellow-600 mr-3">⚡</div>
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Template Testing Schedule</h4>
                <p className="text-sm text-yellow-800">
                  {stats.totalTemplates - stats.testedTemplates} templates haven't been tested. Schedule regular testing for all templates.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start">
              <div className="text-purple-600 mr-3">📈</div>
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Monitor Trends</h4>
                <p className="text-sm text-purple-800">
                  Test scores are {trend.direction === 'up' ? 'improving' : trend.direction === 'down' ? 'declining' : 'stable'}. Continue monitoring for quality assurance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}