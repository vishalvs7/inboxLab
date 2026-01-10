"use client";

import { useState } from 'react';

interface WebhookSimulatorProps {
  onSimulate: (type: 'unsubscribe' | 'bounce' | 'complaint', email: string) => void;
  onAddTest: (email: string, status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained') => void;
}

export default function WebhookSimulator({ onSimulate, onAddTest }: WebhookSimulatorProps) {
  const [webhookType, setWebhookType] = useState<'unsubscribe' | 'bounce' | 'complaint'>('unsubscribe');
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [webhookLog, setWebhookLog] = useState<string[]>([]);

  const simulateWebhook = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const typeLabel = webhookType === 'unsubscribe' ? 'Unsubscribe' : webhookType === 'bounce' ? 'Bounce' : 'Complaint';
    
    onSimulate(webhookType, testEmail);
    
    setWebhookLog(prev => [
      `[${timestamp}] ${typeLabel} webhook received for: ${testEmail}`,
      ...prev.slice(0, 9) // Keep last 10 entries
    ]);
    
    alert(`Simulated ${typeLabel} webhook for ${testEmail}`);
  };

  const addTestContact = (status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained') => {
    const email = `test${Date.now()}@example.com`;
    onAddTest(email, status);
    setTestEmail(email);
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setWebhookLog(prev => [
      `[${timestamp}] Added test contact: ${email} (${status})`,
      ...prev.slice(0, 9)
    ]);
  };

  const webhookUrl = `https://your-domain.com/api/webhooks/${webhookType}`;

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Webhook Simulator</h3>

      {/* Webhook Configuration */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Webhook Configuration</h4>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
          <div className="font-mono text-sm break-all">{webhookUrl}</div>
          <p className="text-xs text-gray-500 mt-2">
            Configure this URL in your email service provider
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">POST</div>
            <div className="text-xs text-gray-600">Method</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">JSON</div>
            <div className="text-xs text-gray-600">Format</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">✓</div>
            <div className="text-xs text-gray-600">Active</div>
          </div>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Simulate Webhook</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Webhook Type</label>
            <div className="flex space-x-2">
              {(['unsubscribe', 'bounce', 'complaint'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setWebhookType(type)}
                  className={`flex-1 py-2 text-sm rounded-md ${
                    webhookType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="test@example.com"
            />
          </div>

          <button
            onClick={simulateWebhook}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Simulate {webhookType.charAt(0).toUpperCase() + webhookType.slice(1)} Webhook
          </button>
        </div>
      </div>

      {/* Test Contacts */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Test Contacts</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addTestContact('subscribed')}
            className="py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
          >
            Add Active
          </button>
          <button
            onClick={() => addTestContact('unsubscribed')}
            className="py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Add Unsubscribed
          </button>
          <button
            onClick={() => addTestContact('bounced')}
            className="py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200"
          >
            Add Bounced
          </button>
          <button
            onClick={() => addTestContact('complained')}
            className="py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
          >
            Add Complaint
          </button>
        </div>
      </div>

      {/* Webhook Log */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700">Webhook Activity Log</h4>
          <button
            onClick={() => setWebhookLog([])}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Clear Log
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
          {webhookLog.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {webhookLog.map((log, index) => (
                <div key={index} className="px-4 py-2">
                  <div className="text-xs font-mono text-gray-700">{log}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No webhook activity yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}