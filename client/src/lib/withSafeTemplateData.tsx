/**
 * Higher-order component (HOC) to wrap CV templates with safe data handling
 * This prevents destructuring errors when template props are null or undefined
 */
import React from 'react';
import { CVData } from '@shared/schema';

/**
 * Wraps a template component with safe data handling
 * @param TemplateComponent The template component to wrap
 * @returns A new component that safely passes props to the template
 */
export default function withSafeTemplateData<P extends CVData>(TemplateComponent: React.ComponentType<P>) {
  return function SafeTemplateWrapper(props: P | null | undefined): JSX.Element {
    // Create a complete safe data object to handle all possible CV data fields
    const safeProps = {
      // Base CV fields with defaults
      personalInfo: {},
      workExperience: [],
      workExperiences: [],
      education: [],
      skills: [],
      summary: '',
      languages: [],
      references: [],
      hobbies: [],
      projects: [],
      certifications: [],
      websites: [],
      // Merge with any provided props
      ...(props || {})
    } as any;
    
    // Handle mixed field names (some templates use workExperience, others use workExperiences)
    if (safeProps.workExperiences && !safeProps.workExperience) {
      safeProps.workExperience = safeProps.workExperiences;
    } else if (safeProps.workExperience && !safeProps.workExperiences) {
      safeProps.workExperiences = safeProps.workExperience;
    }

    // Handle summary - it might be a top-level field or nested in personalInfo
    if (!safeProps.summary && safeProps.personalInfo?.summary) {
      safeProps.summary = safeProps.personalInfo.summary;
    } else if (safeProps.summary && !safeProps.personalInfo?.summary) {
      if (!safeProps.personalInfo) safeProps.personalInfo = {};
      safeProps.personalInfo.summary = safeProps.summary;
    }

    // Additional safety for nested properties that might be null
    if (!safeProps.personalInfo) safeProps.personalInfo = {};
    if (!safeProps.workExperience) safeProps.workExperience = [];
    if (!safeProps.workExperiences) safeProps.workExperiences = [];
    if (!safeProps.education) safeProps.education = [];
    if (!safeProps.skills) safeProps.skills = [];
    if (!safeProps.languages) safeProps.languages = [];
    if (!safeProps.references) safeProps.references = [];
    if (!safeProps.hobbies) safeProps.hobbies = [];
    if (!safeProps.projects) safeProps.projects = [];
    if (!safeProps.certifications) safeProps.certifications = [];
    if (!safeProps.websites) safeProps.websites = [];
    if (safeProps.summary === null || safeProps.summary === undefined) safeProps.summary = '';

    try {
      return <TemplateComponent {...safeProps} />;
    } catch (error) {
      console.error('Error rendering CV template:', error);
      return (
        <div className="template-error" style={{ 
          padding: '20px', 
          backgroundColor: '#fff8f8', 
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          textAlign: 'center',
          maxWidth: '800px', 
          margin: '0 auto' 
        }}>
          <h3 style={{ color: '#d32f2f', marginBottom: '10px' }}>Template Error</h3>
          <p style={{ color: '#555', marginBottom: '10px' }}>
            There was a problem rendering this CV template.
          </p>
          <div style={{ color: '#777', fontSize: '0.9em', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', textAlign: 'left', overflow: 'auto' }}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      );
    }
  };
}
