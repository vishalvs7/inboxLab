// /src/components/tester/ClientPreviewGrid.tsx
"use client";

interface ClientPreviewGridProps {
  emailClients: Array<{
    name: string;
    category: 'desktop' | 'mobile' | 'web';
    marketShare: number;
    renderingEngine: string;
  }>;
  latestResult: any;
  onRunTest: () => void;
  loading: boolean;
}

export default function ClientPreviewGrid({ emailClients, latestResult, onRunTest, loading }: ClientPreviewGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'perfect': return '✓';
      case 'good': return '✓';
      case 'warning': return '⚠';
      case 'failed': return '✗';
      default: return '?';
    }
  };

  const getClientResults = () => {
    if (!latestResult?.clientResults) {
      return {};
    }
    
    const results: Record<string, any> = {};
    latestResult.clientResults.forEach((result: any) => {
      results[result.clientName] = result;
    });
    return results;
  };

  const clientResults = getClientResults();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Email Client Previews</h2>
          <p className="text-gray-600">Preview how your email renders across different email clients</p>
        </div>
        <button
          onClick={onRunTest}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run New Test'}
        </button>
      </div>

      {/* Client Categories */}
      <div className="space-y-8">
        {['desktop', 'mobile', 'web'].map((category) => {
          const clients = emailClients.filter(c => c.category === category);
          
          return (
            <div key={category} className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 capitalize">{category} Clients</h3>
                <p className="text-sm text-gray-600">
                  {clients.length} {category} email clients · {clients.reduce((sum, c) => sum + c.marketShare, 0)}% market share
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client) => {
                    const result = clientResults[client.name];
                    
                    return (
                      <div key={client.name} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{client.name}</div>
                              <div className="text-xs text-gray-500">
                                {client.marketShare}% share · {client.renderingEngine}
                              </div>
                            </div>
                            {result && (
                              <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(result.status)}`}>
                                {getStatusIcon(result.status)} {result.status}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4">
                          {result?.screenshotUrl ? (
                            <div className="space-y-3">
                              <div className="border border-gray-300 rounded overflow-hidden">
                                <img
                                  src={result.screenshotUrl}
                                  alt={`${client.name} preview`}
                                  className="w-full h-32 object-cover"
                                />
                              </div>
                              {result.issues.length > 0 && (
                                <div className="text-xs">
                                  <div className="font-medium text-red-600 mb-1">Issues:</div>
                                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {result.issues.slice(0, 2).map((issue: string, idx: number) => (
                                      <li key={idx}>{issue}</li>
                                    ))}
                                    {result.issues.length > 2 && (
                                      <li className="text-gray-500">+{result.issues.length - 2} more</li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="text-gray-400 mb-2">Not tested yet</div>
                              <div className="text-xs text-gray-500">Run a test to see preview</div>
                            </div>
                          )}
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <button className="w-full py-2 text-sm border border-gray-300 rounded hover:bg-white">
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h4 className="font-medium text-gray-900 mb-3">Status Legend</h4>
        <div className="grid grid-cols-4 gap-4">
          {[
            { status: 'perfect', description: 'Renders perfectly' },
            { status: 'good', description: 'Minor issues' },
            { status: 'warning', description: 'Some problems' },
            { status: 'failed', description: 'Broken layout' }
          ].map((item) => (
            <div key={item.status} className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(item.status).split(' ')[0]}`} />
              <div>
                <div className="text-sm font-medium capitalize">{item.status}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}