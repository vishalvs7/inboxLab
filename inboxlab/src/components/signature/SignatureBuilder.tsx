"use client";

import { useState } from 'react';

interface SignatureBuilderProps {
  signature: any;
  onUpdate: (updates: any) => void;
}

export default function SignatureBuilder({ signature, onUpdate }: SignatureBuilderProps) {
  const [activeSection, setActiveSection] = useState('personal');

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleColorChange = (colorType: string, value: string) => {
    onUpdate({
      colors: {
        ...signature.colors,
        [colorType]: value
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Signature Builder</h3>
      
      {/* Section Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-4 overflow-x-auto">
          {['personal', 'style', 'social', 'advanced'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`py-2 px-1 text-sm font-medium whitespace-nowrap ${
                activeSection === section
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section === 'personal' && 'Personal Info'}
              {section === 'style' && 'Style'}
              {section === 'social' && 'Social Links'}
              {section === 'advanced' && 'Advanced'}
            </button>
          ))}
        </nav>
      </div>

      {/* Personal Info Section */}
      {activeSection === 'personal' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={signature.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={signature.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Marketing Director"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={signature.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="TechCorp Inc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={signature.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={signature.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Photo URL
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={signature.photoUrl}
                onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/photo.jpg"
              />
              <button
                onClick={() => handleInputChange('photoUrl', `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Random
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty for no photo
            </p>
          </div>
        </div>
      )}

      {/* Style Section */}
      {activeSection === 'style' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template
            </label>
            <select
              value={signature.template}
              onChange={(e) => handleInputChange('template', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={signature.font}
              onChange={(e) => handleInputChange('font', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleInputChange('layout', 'vertical')}
                className={`flex-1 py-2 border rounded-md ${
                  signature.layout === 'vertical'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Vertical
              </button>
              <button
                onClick={() => handleInputChange('layout', 'horizontal')}
                className={`flex-1 py-2 border rounded-md ${
                  signature.layout === 'horizontal'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Horizontal
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Colors
            </label>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: signature.colors.primary }}></div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600">Primary Color</label>
                <input
                  type="color"
                  value={signature.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-full h-8 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: signature.colors.secondary }}></div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600">Secondary Color</label>
                <input
                  type="color"
                  value={signature.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-full h-8 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: signature.colors.background }}></div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600">Background</label>
                <input
                  type="color"
                  value={signature.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-full h-8 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Links Section */}
      {activeSection === 'social' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={signature.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter Handle
            </label>
            <input
              type="text"
              value={signature.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="text"
              value={signature.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={signature.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="123 Business St, City, State ZIP"
            />
          </div>
        </div>
      )}

      {/* Advanced Section */}
      {activeSection === 'advanced' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom CSS
            </label>
            <textarea
              placeholder="Add custom CSS styles here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Add custom CSS to fine-tune your signature
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600 mt-2">
                Drop company logo here or click to upload
              </p>
              <input type="file" className="hidden" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => {
            const randomName = ['Alex Johnson', 'Maria Garcia', 'David Smith', 'Lisa Chen'][Math.floor(Math.random() * 4)];
            const randomTitle = ['Senior Developer', 'Product Manager', 'Design Lead', 'Marketing Director'][Math.floor(Math.random() * 4)];
            onUpdate({
              name: randomName,
              title: randomTitle,
              email: `${randomName.toLowerCase().replace(' ', '.')}@company.com`,
            });
          }}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Generate Random Signature
        </button>
      </div>
    </div>
  );
}