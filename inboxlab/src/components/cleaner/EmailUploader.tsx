"use client";

import { useState } from 'react';

interface EmailUploaderProps {
  emails: string[];
  setEmails: (emails: string[]) => void;
  onVerify: () => void;
  loading: boolean;
  progress: number;
  onClear: () => void;
  onLoadSample: () => void;
  onRemoveEmail: (index: number) => void;
}

export default function EmailUploader({
  emails,
  setEmails,
  onVerify,
  loading,
  progress,
  onClear,
  onLoadSample,
  onRemoveEmail
}: EmailUploaderProps) {
  const [inputText, setInputText] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'file' | 'manual'>('paste');

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    
    // Parse emails from text (comma, newline, or space separated)
    const emailList = text
      .split(/[\n,]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0)
      .filter((email, index, self) => self.indexOf(email) === index); // Remove duplicates
    
    if (emailList.length > 0) {
      // Combine arrays and remove duplicates
      const combined = [...emails, ...emailList];
      const uniqueEmails = Array.from(new Set(combined));
      setEmails(uniqueEmails);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const emailList = text
        .split(/[\n,]+/)
        .map(email => email.trim())
        .filter(email => email.length > 0)
        .filter((email, index, self) => self.indexOf(email) === index);
      
      if (emailList.length > 0) {
        // Combine arrays and remove duplicates
        const combined = [...emails, ...emailList];
        const uniqueEmails = Array.from(new Set(combined));
        setEmails(uniqueEmails);
      }
    };
    reader.readAsText(file);
  };

  const addManualEmail = () => {
    const email = prompt('Enter email address:');
    if (email && email.trim()) {
      setEmails([...emails, email.trim()]);
    }
  };

  const removeAllInvalid = () => {
    // Simple validation to remove obviously invalid emails
    const validEmails = emails.filter(email => {
      return email.includes('@') && email.includes('.') && email.length > 5;
    });
    setEmails(validEmails);
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Email List ({emails.length} emails)
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onClear}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            disabled={emails.length === 0}
          >
            Clear All
          </button>
          <button
            onClick={onLoadSample}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Load Sample
          </button>
        </div>
      </div>

      {/* Upload Methods */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setUploadMethod('paste')}
            className={`px-4 py-2 text-sm font-medium ${
              uploadMethod === 'paste'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Paste Emails
          </button>
          <button
            onClick={() => setUploadMethod('file')}
            className={`px-4 py-2 text-sm font-medium ${
              uploadMethod === 'file'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setUploadMethod('manual')}
            className={`px-4 py-2 text-sm font-medium ${
              uploadMethod === 'manual'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add Manually
          </button>
        </div>

        {uploadMethod === 'paste' && (
          <div>
            <textarea
              value={inputText}
              onChange={handlePaste}
              placeholder="Paste email addresses (comma or newline separated)..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => {
                  const emailList = inputText
                    .split(/[\n,]+/)
                    .map(email => email.trim())
                    .filter(email => email.length > 0);
                  // Combine arrays and remove duplicates
                  const combined = [...emails, ...emailList];
                  const uniqueEmails = Array.from(new Set(combined));
                  setEmails(uniqueEmails);
                  setInputText('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Add to List →
              </button>
              <span className="text-sm text-gray-500">
                {inputText.split(/[\n,]+/).filter(e => e.trim()).length} emails detected
              </span>
            </div>
          </div>
        )}

        {uploadMethod === 'file' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 mb-4">
              Upload .txt or .csv file with email addresses
            </p>
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Choose File
            </label>
            <p className="text-xs text-gray-500 mt-4">
              One email per line or comma separated
            </p>
          </div>
        )}

        {uploadMethod === 'manual' && (
          <div className="text-center">
            <button
              onClick={addManualEmail}
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 w-full"
            >
              + Add Email Address
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Click to add individual email addresses
            </p>
          </div>
        )}
      </div>

      {/* Email List Preview */}
      {emails.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">Email List Preview</h4>
            <button
              onClick={removeAllInvalid}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove obviously invalid
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
            {emails.slice(0, 20).map((email, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    email.includes('@') && email.includes('.') 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-900 font-mono">{email}</span>
                </div>
                <button
                  onClick={() => onRemoveEmail(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            {emails.length > 20 && (
              <div className="px-4 py-2 text-center text-sm text-gray-500">
                ... and {emails.length - 20} more emails
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {loading && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Verifying emails...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Checking syntax, domains, and email validity
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={onVerify}
          disabled={loading || emails.length === 0}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying {emails.length} emails...
            </span>
          ) : (
            `Verify ${emails.length} Email${emails.length !== 1 ? 's' : ''}`
          )}
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          Check for invalid, disposable, and role-based email addresses
        </p>
      </div>
    </div>
  );
}