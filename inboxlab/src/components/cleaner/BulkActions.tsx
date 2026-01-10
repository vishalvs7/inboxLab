"use client";

interface BulkActionsProps {
  onExport: (type: 'valid' | 'all' | 'invalid') => void;
  hasResults: boolean;
}

export default function BulkActions({ onExport, hasResults }: BulkActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Bulk Actions</h3>

      <div className="space-y-4">
        <button
          onClick={() => onExport('valid')}
          disabled={!hasResults}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Clean List
        </button>

        <button
          onClick={() => onExport('all')}
          disabled={!hasResults}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Full Report
        </button>

        <button
          onClick={() => onExport('invalid')}
          disabled={!hasResults}
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Export Invalid Emails
        </button>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">API Access</h4>
        <button className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600">
          Get API Key
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Integrate with your CRM or marketing tools
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-700">
              Clean lists reduce bounce rates by up to 98% and improve sender reputation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}