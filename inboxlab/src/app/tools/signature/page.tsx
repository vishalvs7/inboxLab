"use client";

import { useState, useRef } from 'react';
import SignatureBuilder from '@/components/signature/SignatureBuilder';
import TemplateGallery from '@/components/signature/TemplateGallery';
import ExportOptions from '@/components/signature/ExportOptions';

export default function SignatureToolPage() {
  const [signature, setSignature] = useState({
    name: 'John Smith',
    title: 'Marketing Director',
    company: 'TechCorp Inc.',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    website: 'techcorp.com',
    address: '123 Business St, San Francisco, CA 94107',
    linkedin: 'linkedin.com/in/johnsmith',
    twitter: '@johnsmith',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    template: 'modern',
    colors: {
      primary: '#2563eb',
      secondary: '#6b7280',
      background: '#ffffff'
    },
    font: 'Inter',
    layout: 'vertical'
  });

  const [activeTab, setActiveTab] = useState('builder');
  const signatureRef = useRef<HTMLDivElement>(null);

  const handleUpdate = (updates: any) => {
    setSignature(prev => ({ ...prev, ...updates }));
  };

  const handleTemplateSelect = (template: string) => {
    setSignature(prev => ({ ...prev, template }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Signature Generator</h1>
        <p className="text-gray-600">
          Create professional, consistent email signatures for your entire team with our drag & drop builder.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('builder')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'builder'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Signature Builder
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'export'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Export & Install
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Controls */}
        <div className="lg:col-span-1">
          {activeTab === 'builder' && (
            <SignatureBuilder signature={signature} onUpdate={handleUpdate} />
          )}
          {activeTab === 'templates' && (
            <TemplateGallery onSelect={handleTemplateSelect} />
          )}
          {activeTab === 'export' && (
            <ExportOptions signatureRef={signatureRef} signature={signature} />
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg border p-6 sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Live Preview</h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Device:</span>
                <div className="flex bg-gray-100 rounded-md p-1">
                  <button className="px-3 py-1 rounded bg-white shadow">Desktop</button>
                  <button className="px-3 py-1 rounded">Mobile</button>
                </div>
              </div>
            </div>

            {/* Preview Container */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 bg-gray-50 min-h-[400px] flex items-center justify-center">
              <div 
                ref={signatureRef}
                className="bg-white p-6 rounded-lg shadow-inner max-w-2xl mx-auto"
                style={{ fontFamily: signature.font }}
              >
                {/* Signature Preview */}
                {signature.template === 'modern' && (
                  <div className="flex items-start space-x-4">
                    {signature.photoUrl && (
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                          <img 
                            src={signature.photoUrl} 
                            alt={signature.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="border-l-4 pl-4" style={{ borderColor: signature.colors.primary }}>
                        <h3 className="text-xl font-bold text-gray-900" style={{ color: signature.colors.primary }}>
                          {signature.name}
                        </h3>
                        <p className="text-gray-700 font-medium">{signature.title}</p>
                        <p className="text-gray-600 font-medium">{signature.company}</p>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <a href={`mailto:${signature.email}`} className="text-blue-600 hover:underline">
                            {signature.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span>{signature.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                          </svg>
                          <a href={`https://${signature.website}`} className="text-blue-600 hover:underline">
                            {signature.website}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-600">{signature.address}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-4">
                        {signature.linkedin && (
                          <a href="#" className="text-gray-600 hover:text-blue-700">
                            <span className="flex items-center">
                              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                              LinkedIn
                            </span>
                          </a>
                        )}
                        {signature.twitter && (
                          <a href="#" className="text-gray-600 hover:text-blue-400">
                            <span className="flex items-center">
                              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                              </svg>
                              Twitter
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {signature.template === 'classic' && (
                  <div className="border-t-2 pt-4" style={{ borderColor: signature.colors.primary }}>
                    <h3 className="text-lg font-bold text-gray-900">{signature.name}</h3>
                    <p className="text-gray-700">{signature.title} | {signature.company}</p>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>📧 {signature.email} | 📞 {signature.phone}</p>
                      <p>🌐 {signature.website} | 📍 {signature.address}</p>
                    </div>
                  </div>
                )}

                {signature.template === 'minimal' && (
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900">{signature.name}</h3>
                    <p className="text-gray-600">{signature.title}</p>
                    <div className="mt-2 flex justify-center space-x-4 text-sm">
                      <a href={`mailto:${signature.email}`} className="text-blue-600">Email</a>
                      <span>•</span>
                      <span>{signature.phone}</span>
                      <span>•</span>
                      <a href={`https://${signature.website}`} className="text-blue-600">Website</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              This signature will appear at the bottom of your emails
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}