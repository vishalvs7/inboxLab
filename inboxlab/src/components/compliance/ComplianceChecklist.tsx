"use client";

import { useState } from 'react';

export default function ComplianceChecklist() {
  const [checks, setChecks] = useState([
    { id: 1, text: 'Clear "From" name and address', checked: false },
    { id: 2, text: 'Non-deceptive subject line', checked: false },
    { id: 3, text: 'Clear identification as advertisement', checked: false },
    { id: 4, text: 'Valid physical postal address', checked: false },
    { id: 5, text: 'Clear unsubscribe mechanism', checked: false },
    { id: 6, text: 'Honor unsubscribe within 10 days', checked: false },
    { id: 7, text: 'GDPR consent for EU recipients', checked: false },
    { id: 8, text: 'No misleading headers', checked: false },
    { id: 9, text: 'Proper handling of bounced emails', checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecks(checks.map(check => 
      check.id === id ? { ...check, checked: !check.checked } : check
    ));
  };

  const checkedCount = checks.filter(c => c.checked).length;
  const percentage = Math.round((checkedCount / checks.length) * 100);

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Compliance Checklist</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
          <div className="text-xs text-gray-600">Complete</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {checks.map((check) => (
          <div 
            key={check.id}
            onClick={() => toggleCheck(check.id)}
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 flex-shrink-0 ${
              check.checked 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
              {check.checked && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${check.checked ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
              {check.text}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{checkedCount}/{checks.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> This checklist helps ensure CAN-SPAM and GDPR compliance. Not legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}