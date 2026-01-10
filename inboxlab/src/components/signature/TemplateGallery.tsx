"use client";

interface TemplateGalleryProps {
  onSelect: (template: string) => void;
}

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with profile photo',
    color: 'bg-blue-500',
    preview: 'M'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Professional business style',
    color: 'bg-gray-600',
    preview: 'C'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and compact',
    color: 'bg-green-500',
    preview: 'M'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'For designers and creatives',
    color: 'bg-purple-500',
    preview: 'C'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Formal business template',
    color: 'bg-indigo-600',
    preview: 'B'
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong colors and typography',
    color: 'bg-red-500',
    preview: 'B'
  }
];

export default function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Choose a Template</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                {template.preview}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            </div>
            <div className="text-xs text-blue-600 font-medium">Select Template →</div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Want more templates?</p>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Browse Premium Templates
          </button>
        </div>
      </div>
    </div>
  );
}