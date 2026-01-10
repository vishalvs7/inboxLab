"use client";

interface EmailValidatorProps {
  emailContent: string;
  setEmailContent: (content: string) => void;
  onValidate: () => void;
  loading: boolean;
  onLoadSample: (content: string) => void;
  sampleEmails: Array<{ title: string; content: string }>;
}

export default function EmailValidator({
  emailContent,
  setEmailContent,
  onValidate,
  loading,
  onLoadSample,
  sampleEmails
}: EmailValidatorProps) {
  const wordCount = emailContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = emailContent.length;

  const getWordCountColor = () => {
    if (wordCount < 50) return 'text-red-600';
    if (wordCount < 150) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Validate Your Email</h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600">{wordCount} words</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{charCount} characters</span>
        </div>
      </div>

      {/* Email Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste your email content below
        </label>
        <div className="relative">
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste your cold email here to check for spam triggers and compliance issues..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            spellCheck="false"
          />
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <button
              onClick={() => setEmailContent('')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(emailContent)}
              disabled={!emailContent.trim()}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mt-2 text-sm">
          <span className={`font-medium ${getWordCountColor()}`}>
            {wordCount < 50 ? 'Too short' : wordCount < 150 ? 'Good length' : 'Consider shortening'}
          </span>
          <span className="text-gray-500 ml-2">
            Ideal cold email: 50-150 words
          </span>
        </div>
      </div>

      {/* Sample Emails */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Try sample emails
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sampleEmails.map((sample, index) => (
            <button
              key={index}
              onClick={() => onLoadSample(sample.content)}
              className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 text-left"
            >
              <div className="font-medium text-gray-900">{sample.title}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {sample.content.substring(0, 40)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={onValidate}
          disabled={loading || !emailContent.trim()}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing Email...
            </span>
          ) : (
            'Validate Email for Spam & Compliance'
          )}
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          Checks for spam triggers, CAN-SPAM compliance, and deliverability issues
        </p>
      </div>
    </div>
  );
}
