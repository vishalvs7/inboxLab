// /src/components/tester/TestResults.tsx
"use client";

import { useState } from 'react';

interface TestResultsProps {
  results: Array<{
    id: string;
    templateId: string;
    timestamp: Date;
    overallScore: number;
    issuesFound: number;
    clientResults: Array<{
      clientName: string;
      status: string;
      issues: string[];
    }>;
  }>;
  templates: Array<{
    id: string;
    name: string;
  }>;
  onExport: (format: 'csv' | 'json' | 'html') => void;
}

export default function TestResults({ results, templates, onExport }: TestResultsProps) {
  const [selectedResult, setSelectedResult] = useState<string | null>(results[0]?.id || null);

  const getTemplateName = (templateId: string) => {
    return templates.find(t => t.id === templateId)?.name || 'Unknown Template';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const selectedResultData = results.find(r => r.id === selectedResult);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Test Results</h2>
          <p className="text-gray-600">Detailed results from all email client tests</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onExport('csv')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport('json')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Test History</h3>
              <p className="text-sm text-gray-600">{results.length} tests</p>
            </div>
            <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => setSelectedResult(result.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 ${
                    selectedResult === result.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">
                      {getTemplateName(result.templateId)}
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-red-600 mr-3">
                      {result.issuesFound} issues
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.clientResults.length} clients tested
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Details */}
        <div className="lg:col-span-2">
          {selectedResultData ? (
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {getTemplateName(selectedResultData.templateId)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tested on {new Date(selectedResultData.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(selectedResultData.overallScore).split(' ')[0]}`}>
                      {selectedResultData.overallScore}/100
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Score Breakdown */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedResultData.clientResults.filter(c => c.status === 'perfect').length}
                      </div>
                      <div className="text-sm text-gray-600">Perfect</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedResultData.clientResults.filter(c => c.status === 'warning').length}
                      </div>
                      <div className="text-sm text-gray-600">Warnings</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {selectedResultData.clientResults.filter(c => c.status === 'failed').length}
                      </div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                  </div>
                </div>

                {/* Issues Summary */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Issues Found ({selectedResultData.issuesFound})
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const allIssues = selectedResultData.clientResults.flatMap(c => c.issues);
                      // FIXED: Using Array.from() instead of spread operator for Set
                      const uniqueIssues = Array.from(new Set(allIssues));
                      
                      return uniqueIssues.length > 0 ? (
                        <div className="space-y-2">
                          {uniqueIssues.slice(0, 5).map((issue, index) => (
                            <div key={index} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                              <span className="text-sm text-red-800">{issue}</span>
                            </div>
                          ))}
                          {uniqueIssues.length > 5 && (
                            <div className="text-center text-sm text-gray-500 py-2">
                              +{uniqueIssues.length - 5} more issues
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-green-700 font-medium">No issues found! Perfect score!</div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Client Status Grid */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Client-by-Client Results</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {selectedResultData.clientResults.map((client, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium truncate" title={client.clientName}>
                            {client.clientName}
                          </div>
                          <span className={`w-2 h-2 rounded-full ${
                            client.status === 'perfect' ? 'bg-green-500' :
                            client.status === 'good' ? 'bg-blue-500' :
                            client.status === 'warning' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                        </div>
                        <div className="text-xs text-gray-500">
                          {client.issues.length > 0 ? `${client.issues.length} issues` : 'No issues'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Selected</h3>
              <p className="text-gray-600">Select a test from the history to view detailed results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}