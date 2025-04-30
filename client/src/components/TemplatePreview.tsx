import React from 'react';
import { CVData } from '@shared/schema';
import ClientSideTemplateRenderer from './ClientSideTemplateRenderer';
import { getTemplateById } from '@/lib/templates-registry';
import { Card } from '@/components/ui/card';

interface TemplatePreviewProps {
  templateId: string;
  cvData: CVData;
  className?: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId, cvData, className = '' }) => {
  const template = getTemplateById(templateId);
  
  if (!template) {
    return (
      <Card className={`flex items-center justify-center p-6 ${className}`}>
        <p className="text-red-500">Template not found</p>
      </Card>
    );
  }

  return (
    <Card className={`cv-preview-container overflow-hidden ${className}`}>
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h3 className="font-medium">{template.name} Preview</h3>
        <span className="text-sm text-gray-500">Live preview updates as you type</span>
      </div>
      <div className="aspect-[1/1.414] overflow-auto"> {/* A4 aspect ratio */}
        <ClientSideTemplateRenderer 
          templateId={templateId} 
          cvData={cvData} 
          className="h-full"
        />
      </div>
    </Card>
  );
};

export default TemplatePreview;