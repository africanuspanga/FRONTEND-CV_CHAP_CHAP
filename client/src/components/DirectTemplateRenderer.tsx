import React from 'react';
import { CVData } from '@shared/schema';
import { getTemplateByID } from '@/lib/simple-template-registry';

interface DirectTemplateRendererProps {
  cvData: CVData;
  templateId: string;
  height?: number;
}

const DirectTemplateRenderer: React.FC<DirectTemplateRendererProps> = ({
  cvData,
  templateId,
  height = 600
}) => {
  // Log the data for debugging
  console.log('Direct renderer data:', {
    personalInfo: cvData?.personalInfo || {},
    workExp: cvData?.workExperiences || cvData?.workExperience || [],
    templateId
  });

  // Create a wrapper container to maintain consistent height/scroll
  const containerStyle: React.CSSProperties = {
    height: `${height}px`,
    overflow: 'auto',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  };

  // Get the template from the registry
  const template = getTemplateByID(templateId);

  if (template && template.render) {
    // Render the template using the template registry's render function
    return (
      <div className="template-container" style={containerStyle}>
        {template.render(cvData || {})}
      </div>
    );
  }

  // Fallback if template not found
  return (
    <div className="p-4 border rounded-md bg-white" style={containerStyle}>
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {cvData?.personalInfo?.firstName || ''} {cvData?.personalInfo?.lastName || ''}
          </h1>
          <h2 className="text-lg text-gray-600 mb-4">
            {cvData?.personalInfo?.professionalTitle || cvData?.personalInfo?.jobTitle || ''}
          </h2>
          
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <div>{cvData?.personalInfo?.email}</div>
            <div>{cvData?.personalInfo?.phone}</div>
            <div>{cvData?.personalInfo?.address || cvData?.personalInfo?.location}</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium border-b pb-1 mb-3">Summary</h3>
          <p>{cvData?.personalInfo?.summary}</p>
        </div>
        
        <div className="mt-6 text-center text-gray-500">
          <p>Template "{templateId}" not found or could not be loaded.</p>
          <p className="text-sm mt-2">Please select a different template.</p>
        </div>
      </div>
    </div>
  );
};

export default DirectTemplateRenderer;