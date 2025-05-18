import React, { useState, useEffect } from 'react';
import { CVData } from '@shared/schema';
import { getTemplateByID } from '@/lib/simple-template-registry';
import withSafeTemplateData from '@/lib/withSafeTemplateData';
import { AlertTriangle } from 'lucide-react';

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
  const [renderError, setRenderError] = useState<string | null>(null);
  const [hasRendered, setHasRendered] = useState(false);
  
  // Reset render state when template or data changes
  useEffect(() => {
    setRenderError(null);
    setHasRendered(false);
  }, [templateId, cvData]);
  
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
    try {
      // Clean personal info data (trim whitespace)
      const cleanedPersonalInfo = {
        ...cvData?.personalInfo,
        firstName: cvData?.personalInfo?.firstName?.trim() || '',
        lastName: cvData?.personalInfo?.lastName?.trim() || '',
        professionalTitle: cvData?.personalInfo?.professionalTitle?.trim() || ''
      };

      // Ensure professionalTitle is set - apply fallback logic
      if (!cleanedPersonalInfo.professionalTitle) {
        // 1. Try job title from personal info
        cleanedPersonalInfo.professionalTitle = cvData?.personalInfo?.jobTitle?.trim() || '';
        
        // 2. Try first work experience job title
        if (!cleanedPersonalInfo.professionalTitle && cvData?.workExperiences && cvData.workExperiences.length > 0) {
          cleanedPersonalInfo.professionalTitle = cvData.workExperiences[0].jobTitle?.trim() || '';
        }
        
        // 3. If still no title but we have a company name, use "Professional at Company"
        if (!cleanedPersonalInfo.professionalTitle && cvData?.workExperiences && cvData.workExperiences.length > 0) {
          const company = cvData.workExperiences[0].company?.trim();
          if (company) {
            cleanedPersonalInfo.professionalTitle = `Professional at ${company}`;
          }
        }
        
        // 4. Default fallback if all else fails
        if (!cleanedPersonalInfo.professionalTitle) {
          cleanedPersonalInfo.professionalTitle = "Professional";
        }
        
        console.log(`Fixed missing professional title in renderer with: "${cleanedPersonalInfo.professionalTitle}"`);
      }

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
          location: cleanedPersonalInfo.location || cleanedPersonalInfo.address || '',
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
          cvData.hobbies.map(h => typeof h === 'object' ? (h.name || '') : h).join(', ') :
          // Otherwise use as is or empty string
          cvData?.hobbies || '',
      };
      
      // Add more debugging info
      console.log('Processed template data for final preview:', processedData);
      
      // Set render status
      useEffect(() => {
        setHasRendered(true);
      }, []);
      
      // Render the template using the template registry's render function with safe data
      return (
        <div style={containerStyle}>
          {template.render(processedData)}
        </div>
      );
    } catch (error: any) {
      console.error('Error rendering template:', error);
      setRenderError(`Error rendering template: ${error?.message || 'Unknown error'}`);
      
      // Fall through to the fallback renderer
    }
  }

  // Fallback if template not found or error occurred during rendering
  // Clean personal info data (trim whitespace) for the fallback view
  const cleanedPersonalInfo = {
    ...cvData?.personalInfo,
    firstName: cvData?.personalInfo?.firstName?.trim() || '',
    lastName: cvData?.personalInfo?.lastName?.trim() || '',
    professionalTitle: cvData?.personalInfo?.professionalTitle?.trim() || '',
    address: cvData?.personalInfo?.address?.trim() || '',
    summary: cvData?.personalInfo?.summary || ''
  };
  
  // Apply professional title fallback if needed
  if (!cleanedPersonalInfo.professionalTitle) {
    if (cvData?.personalInfo?.jobTitle) {
      cleanedPersonalInfo.professionalTitle = cvData.personalInfo.jobTitle;
    } else if (cvData?.workExperiences?.length > 0 && cvData.workExperiences[0].jobTitle) {
      cleanedPersonalInfo.professionalTitle = cvData.workExperiences[0].jobTitle;
    } else {
      cleanedPersonalInfo.professionalTitle = "Professional";
    }
  }

  return (
    <div className="p-4 border rounded-md bg-white" style={containerStyle}>
      <div className="p-6">
        {/* Error message if rendering failed */}
        {renderError && (
          <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-md text-amber-700">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Template rendering issue</p>
                <p className="text-sm mt-1">We couldn't render this template with your data. Try selecting a different template.</p>
                <p className="text-xs mt-2 text-amber-600">{renderError}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Basic CV display when template not found or failed to render */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {cleanedPersonalInfo.firstName} {cleanedPersonalInfo.lastName}
          </h1>
          <h2 className="text-lg text-gray-600 mb-4">
            {cleanedPersonalInfo.professionalTitle}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-500">
            {cleanedPersonalInfo.email && <div>{cleanedPersonalInfo.email}</div>}
            {cvData?.personalInfo?.phone && <div>{cvData.personalInfo.phone}</div>}
            {cleanedPersonalInfo.address && <div>{cleanedPersonalInfo.address}</div>}
          </div>
        </div>
        
        {cleanedPersonalInfo.summary && (
          <div className="mt-6">
            <h3 className="text-lg font-medium border-b pb-1 mb-3">Summary</h3>
            <p>{cleanedPersonalInfo.summary}</p>
          </div>
        )}
        
        {/* Work experience section if available */}
        {cvData?.workExperiences && cvData.workExperiences.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium border-b pb-1 mb-3">Work Experience</h3>
            {cvData.workExperiences.map((exp, index) => (
              <div key={exp.id || index} className="mb-4">
                <h4 className="font-medium">{exp.jobTitle}</h4>
                <div className="text-sm text-gray-600">{exp.company}</div>
                <div className="text-xs text-gray-500 mb-1">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md text-center text-gray-600">
          <p>Template "{templateId}" could not be displayed properly.</p>
          <p className="text-sm mt-2">Please select a different template or continue to download anyway.</p>
        </div>
      </div>
    </div>
  );
};

export default DirectTemplateRenderer;