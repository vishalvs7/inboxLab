"use client";

interface EmailResult {
  id: string;
  email: string;
  status: 'valid' | 'invalid' | 'risky' | 'disposable' | 'role';
  reason?: string;
  confidence: number;
  verifiedAt: Date;
}

interface ListStatisticsProps {
  results: EmailResult[];
}

export default function ListStatistics({ results }: ListStatisticsProps) {
  const validCount = results.filter(r => r.status === 'valid').length;
  const invalidCount = results.filter(r => r.status === 'invalid').length;
  const riskyCount = results.filter(r => r.status === 'risky').length;
  const disposableCount = results.filter(r => r.status === 'disposable').length;
  const roleCount = results.filter(r => r.status === 'role').length;
  
  const total = results.length;
  const validPercentage = total > 0 ? Math.round((validCount / total) * 100) : 0;
  const costPerEmail = 0.01; // Example cost
  const potentialSavings = (invalidCount + disposableCount + roleCount) * costPerEmail;

  const getDomainStats = () => {
    const domains = new Map<string, number>();
    results.forEach(result => {
      const domain = result.email.split('@')[1];
      if (domain) {
        domains.set(domain, (domains.get(domain) || 0) + 1);
      }
    });
    
    return Array.from(domains.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">List Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{validCount}</div>
          <div className="text-xs text-gray-600">Valid</div>
          <div className="text-xs text-green-600 font-medium">{validPercentage}%</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{invalidCount}</div>
          <div className="text-xs text-gray-600">Invalid</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{riskyCount}</div>
          <div className="text-xs text-gray-600">Risky</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{disposableCount}</div>
          <div className="text-xs text-gray-600">Disposable</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{roleCount}</div>
          <div className="text-xs text-gray-600">Role-based</div>
        </div>
      </div>

      {/* Quality Score */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>List Quality Score</span>
          <span className="font-medium">{validPercentage}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              validPercentage >= 80 ? 'bg-green-500' :
              validPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${validPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Poor</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Top Domains */}
      {getDomainStats().length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Top Domains</h4>
          <div className="space-y-2">
            {getDomainStats().map(([domain, count]) => (
              <div key={domain} className="flex items-center justify-between">
                <span className="text-sm text-gray-900 font-mono">{domain}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Savings Calculator */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Cost Savings</h4>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-800">Potential monthly savings:</span>
            <span className="text-lg font-bold text-green-700">
              ${potentialSavings.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-green-700">
            Based on removing {invalidCount + disposableCount + roleCount} invalid emails
            at ${costPerEmail.toFixed(2)} per email
          </p>
        </div>
      </div>
    </div>
  );
}