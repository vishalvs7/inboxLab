"use client";
import { useState } from 'react';
import { useRef } from 'react';

interface ExportOptionsProps {
  signatureRef: React.RefObject<HTMLDivElement>;
  signature: any;
}

export default function ExportOptions({ signatureRef, signature }: ExportOptionsProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (signatureRef.current) {
      const html = signatureRef.current.innerHTML;
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadHTML = () => {
    if (signatureRef.current) {
      const html = signatureRef.current.innerHTML;
      const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Signature - ${signature.name}</title>
    <style>
        body { font-family: ${signature.font}, Arial, sans-serif; margin: 0; padding: 20px; }
        .signature { max-width: 600px; }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
      
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signature-${signature.name.toLowerCase().replace(' ', '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getSetupInstructions = () => {
    const clients = [
      { name: 'Gmail', icon: 'G' },
      { name: 'Outlook', icon: 'O' },
      { name: 'Apple Mail', icon: 'A' },
      { name: 'Thunderbird', icon: 'T' }
    ];

    return clients;
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Export & Install</h3>

      {/* Copy HTML */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Copy HTML Code
        </label>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy HTML
              </>
            )}
          </button>
          <button
            onClick={downloadHTML}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Email Client Setup */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Setup Instructions
        </label>
        <div className="space-y-3">
          {getSetupInstructions().map((client) => (
            <div key={client.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                  <span className="font-bold text-gray-700">{client.icon}</span>
                </div>
                <span className="font-medium text-gray-900">{client.name}</span>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                View Guide →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Team Features */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Team Features</h4>
        <div className="space-y-2">
          <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
            Generate Bulk Signatures
          </button>
          <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            Save as Team Template
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Tip:</span> After copying HTML, paste it in your email client's signature settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}