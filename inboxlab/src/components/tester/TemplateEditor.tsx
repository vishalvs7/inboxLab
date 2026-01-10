// /src/components/tester/TemplateEditor.tsx
"use client";

import { useState } from 'react';

interface TemplateEditorProps {
  template: {
    id: string;
    name: string;
    htmlContent: string;
    cssContent: string;
    tags: string[];
  };
  onUpdate: (updates: { name?: string; htmlContent?: string; cssContent?: string; tags?: string[] }) => void;
  onDelete: () => void;
}

export default function TemplateEditor({ template, onUpdate, onDelete }: TemplateEditorProps) {
  const [html, setHtml] = useState(template.htmlContent);
  const [css, setCss] = useState(template.cssContent);
  const [name, setName] = useState(template.name);
  const [activeTab, setActiveTab] = useState('html');
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    onUpdate({ 
      name, 
      htmlContent: html, 
      cssContent: css,
      tags: template.tags
    });
    alert('Template saved successfully!');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !template.tags.includes(newTag.trim())) {
      onUpdate({ tags: [...template.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: template.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-xl font-bold text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none w-full"
            placeholder="Template Name"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {template.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
          <div className="flex items-center">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add tag..."
              className="text-sm border-0 focus:ring-0 focus:outline-none px-2 py-1"
            />
            <button
              onClick={handleAddTag}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Editor Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {['html', 'css', 'preview'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'html' && 'HTML Editor'}
              {tab === 'css' && 'CSS Editor'}
              {tab === 'preview' && 'Preview'}
            </button>
          ))}
        </nav>
      </div>

      {/* Editor Content */}
      <div className="p-0">
        {activeTab === 'html' && (
          <div className="h-96">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full h-full font-mono text-sm p-4 border-0 focus:ring-0 focus:outline-none resize-none"
              placeholder="Enter your HTML here..."
              spellCheck="false"
            />
          </div>
        )}

        {activeTab === 'css' && (
          <div className="h-96">
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="w-full h-full font-mono text-sm p-4 border-0 focus:ring-0 focus:outline-none resize-none"
              placeholder="Enter your CSS here..."
              spellCheck="false"
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-96 overflow-auto p-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-sm font-medium">
                Email Preview
              </div>
              <div 
                className="p-4"
                dangerouslySetInnerHTML={{ __html: `<style>${css}</style>${html}` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Quick Actions:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const sampleHTML = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
  <h2 style="color: #2563eb;">Sample Email Template</h2>
  <p>This is a sample email template. Edit it to create your own design.</p>
  <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Call to Action</a>
</div>`;
                setHtml(sampleHTML);
              }}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Load Sample
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(html);
                alert('HTML copied to clipboard!');
              }}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Copy HTML
            </button>
            <button
              onClick={() => {
                setHtml('');
                setCss('');
              }}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}