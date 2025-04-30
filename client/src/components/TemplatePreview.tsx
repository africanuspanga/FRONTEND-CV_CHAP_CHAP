import React from 'react';
import { CVData } from '@shared/schema';
import ClientSideTemplateRenderer from './ClientSideTemplateRenderer';

interface TemplatePreviewProps {
  templateId: string;
  cvData: CVData;
  className?: string;
}

/**
 * Preview component for a CV template with sample data
 */
const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  templateId, 
  cvData,
  className = ''
}) => {
  return (
    <div className={`template-preview overflow-hidden ${className}`}>
      <ClientSideTemplateRenderer
        templateId={templateId}
        cvData={cvData}
        className="scale-[0.5] origin-top transform w-[200%] mx-auto max-h-[800px]"
      />
    </div>
  );
};

export default TemplatePreview;