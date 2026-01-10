"use client";

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

interface ValidationHistoryProps {
  history: ValidationResult[];
  onLoad: (result: ValidationResult) => void;
  onClear: () => void;
}

export default function ValidationHistory({ history, onLoad, onClear }: ValidationHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Validations</h3>
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        {history.slice(0, 5).map((result) => (
          <div 
            key={result.id}
            onClick={() => onLoad(result)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${getRiskColor(result.riskLevel)}`}>
                    {result.spamScore}/100
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(result.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {result.emailPreview}
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Issues: {result.issues.length}</span>
              <span>Click to reload</span>
            </div>
          </div>
        ))}
      </div>

      {history.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Showing 5 of {history.length} validations
          </p>
        </div>
      )}
    </div>
  );
}