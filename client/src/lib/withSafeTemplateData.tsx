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
    // Ensure we have default values for all CV data properties
    const safeProps = {
      personalInfo: {},
      workExperience: [],
      education: [],
      skills: [],
      summary: '',
      languages: [],
      references: [],
      ...(props || {})
    } as P;

    // Additional safety for nested properties that might be null
    if (!safeProps.personalInfo) safeProps.personalInfo = {};
    if (!safeProps.workExperience) safeProps.workExperience = [];
    if (!safeProps.education) safeProps.education = [];
    if (!safeProps.skills) safeProps.skills = [];
    if (!safeProps.languages) safeProps.languages = [];
    if (!safeProps.references) safeProps.references = [];
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
