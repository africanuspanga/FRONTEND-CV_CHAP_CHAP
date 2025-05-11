import React from 'react';
import { CVData } from '@shared/schema';
import { getTemplateByID } from '@/lib/simple-template-registry';
import withSafeTemplateData from '@/lib/withSafeTemplateData';

interface DirectTemplateRendererProps {
  cvData: CVData;
  templateId: string;
  height?: number | "auto";
  width?: string | number;
  scaleFactor?: number;
}

const DirectTemplateRenderer: React.FC<DirectTemplateRendererProps> = ({
  cvData,
  templateId,
  height = 600,
  width = "auto",
  scaleFactor = 0.65
}) => {
  // Log the data for debugging
  console.log('Direct renderer data:', {
    personalInfo: cvData?.personalInfo || {},
    workExp: cvData?.workExperiences || [],
    templateId
  });

  // Create a wrapper container for template
  const containerStyle: React.CSSProperties = {
    height: height === "auto" ? "auto" : `${height}px`,
    width: width === "auto" ? "100%" : typeof width === 'number' ? `${width}px` : width,
    overflow: 'visible',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderRadius: '0',
    border: 'none',
    padding: '0',
    margin: '0 auto',
    touchAction: 'pan-y', // Allow vertical panning on mobile
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  };

  // Get the template from the registry
  const template = getTemplateByID(templateId);

  if (template && template.render) {
    // Clean personal info data (trim whitespace)
    const cleanedPersonalInfo = {
      ...cvData?.personalInfo,
      firstName: cvData?.personalInfo?.firstName?.trim() || '',
      lastName: cvData?.personalInfo?.lastName?.trim() || '',
      professionalTitle: cvData?.personalInfo?.professionalTitle?.trim() || ''
    };

    // Clean work experiences data
    const cleanedWorkExperiences = (cvData?.workExperiences || []).map(exp => ({
      ...exp,
      jobTitle: exp.jobTitle?.trim() || '',
      company: exp.company?.trim() || '',
      location: exp.location?.trim() || ''
    }));

    // Clean education data
    const cleanedEducation = (cvData?.education || []).map(edu => ({
      ...edu,
      field: edu.field?.trim() || '',
      location: edu.location?.trim() || '',
      institution: edu.institution?.trim() || '',
      degree: edu.degree?.trim() || ''
    }));
    
    // Convert and massage data if needed
    // Make sure workExperiences is used correctly
    const processedData = {
      ...cvData,
      // Add cleaned data
      personalInfo: {
        ...cleanedPersonalInfo,
        // Ensure location is available for templates that use it instead of address
        location: cleanedPersonalInfo.address || '',
        // Map professionalTitle to jobTitle for templates that use jobTitle
        jobTitle: cleanedPersonalInfo.professionalTitle || '',
      },
      workExperiences: cleanedWorkExperiences,
      education: cleanedEducation,
      // Set name correctly
      name: `${cleanedPersonalInfo.firstName} ${cleanedPersonalInfo.lastName}`.trim(),
      // Ensure workExperience is available (some templates use this name)
      workExperience: cleanedWorkExperiences,
      // Format the hobbies field correctly
      hobbies: Array.isArray(cvData?.hobbies) ? 
        // If it's an array of hobby objects, join the names
        cvData.hobbies.map(h => h.name || h).join(', ') :
        // Otherwise use as is or empty string
        cvData?.hobbies || '',
    };
    
    // Add more debugging info
    console.log('Processed template data for final preview:', processedData);
    
    // Render the template using the template registry's render function with safe data
    return (
      <div style={containerStyle}>
        {template.render(processedData)}
      </div>
    );
  }

  // Fallback if template not found
  // Clean personal info data (trim whitespace) for the fallback view
  const cleanedPersonalInfo = {
    ...cvData?.personalInfo,
    firstName: cvData?.personalInfo?.firstName?.trim() || '',
    lastName: cvData?.personalInfo?.lastName?.trim() || '',
    professionalTitle: cvData?.personalInfo?.professionalTitle?.trim() || '',
    address: cvData?.personalInfo?.address?.trim() || '',
    summary: cvData?.personalInfo?.summary || ''
  };

  return (
    <div className="p-4 border rounded-md bg-white" style={containerStyle}>
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {cleanedPersonalInfo.firstName} {cleanedPersonalInfo.lastName}
          </h1>
          <h2 className="text-lg text-gray-600 mb-4">
            {cleanedPersonalInfo.professionalTitle}
          </h2>
          
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <div>{cleanedPersonalInfo.email}</div>
            <div>{cleanedPersonalInfo.phone}</div>
            <div>{cleanedPersonalInfo.address}</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium border-b pb-1 mb-3">Summary</h3>
          <p>{cleanedPersonalInfo.summary}</p>
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