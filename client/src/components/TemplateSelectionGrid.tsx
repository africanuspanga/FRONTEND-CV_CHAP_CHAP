import React, { useState, useEffect } from 'react';
import { getAllTemplatesWithMetadata as getAllTemplates, TemplateWithMetadata } from '@/lib/templates-registry';
import { getTemplatesByCategory } from '@/lib/simple-template-registry';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TemplatePreviewImage from './TemplatePreviewImage';

interface TemplateSelectionGridProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
  filterCategory?: string;
}

const TemplateSelectionGrid: React.FC<TemplateSelectionGridProps> = ({
  onSelectTemplate,
  selectedTemplateId,
  filterCategory
}) => {
  // Get templates from either filtered category or all templates
  const templates = filterCategory 
    ? getTemplatesByCategory(filterCategory).map(template => ({
        ...template,
        description: 'Professional CV template with clean design.',
        previewImage: '',
        category: filterCategory,
        popularity: 4
      }))
    : getAllTemplates().map(template => ({
        ...template,
        category: 'Modern',
        popularity: template.isPopular ? 5 : 4
      }));

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 sm:mb-8 px-2 sm:px-0">Available Templates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-2 sm:px-0">
        {templates.map((template) => (
          <div key={template.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Template Preview Container */}
            <div className="relative aspect-[0.71/1] w-full overflow-hidden bg-gray-50 p-2">
              {/* Template Preview */}
              <div className="w-full h-full">
                {template.previewImage ? (
                  <div className="w-full h-full bg-white flex items-center justify-center p-2">
                    <img 
                      src={template.previewImage} 
                      alt={`${template.name} Template Preview`} 
                      className="max-w-[95%] max-h-[98%] object-contain"
                      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                ) : (
                  <TemplatePreviewImage templateId={template.id} templateName={template.name} />
                )}
              </div>
              
              {/* Hover Overlay with Select Button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <Button 
                  variant="default"
                  onClick={() => onSelectTemplate(template.id)}
                  className="text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  size="lg"
                >
                  {selectedTemplateId === template.id ? "Already Selected" : "Select Template"}
                </Button>
              </div>
            </div>
            
            {/* Template Name with Clean Border */}
            <div className="p-4 text-center border-t">
              <h3 className="font-semibold text-lg text-gray-900">{template.name}</h3>
              {selectedTemplateId === template.id && (
                <div className="mt-1 text-sm text-blue-600 font-medium">✓ Selected</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelectionGrid;