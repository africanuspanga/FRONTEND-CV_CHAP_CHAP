import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye, AlertCircle } from 'lucide-react';
import { ClientSideTemplateRenderer } from './ClientSideTemplateRenderer';
import DirectTemplateRenderer from './DirectTemplateRenderer';
import { CVData } from '@shared/schema';
import ErrorBoundary from './ErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LiveCVPreviewProps {
  cvData: CVData;
  templateId: string;
}

const LiveCVPreview: React.FC<LiveCVPreviewProps> = ({ cvData, templateId }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Validate CV data to ensure it has the necessary structure
  const validatedData = useMemo(() => {
    try {
      // Create a deep copy to avoid modifying the original data
      const processedData = JSON.parse(JSON.stringify(cvData || {}));
      
      // Ensure personal info exists
      if (!processedData.personalInfo) {
        processedData.personalInfo = {};
      }
      
      // Ensure work experience arrays exist
      if (!Array.isArray(processedData.workExperiences)) {
        processedData.workExperiences = [];
      }
      
      if (!Array.isArray(processedData.workExp)) {
        processedData.workExp = [];
      }
      
      // Ensure other arrays exist
      ['education', 'skills', 'languages', 'references', 
       'certifications', 'projects', 'hobbies', 'websites', 
       'accomplishments'].forEach(field => {
        if (!Array.isArray(processedData[field])) {
          processedData[field] = [];
        }
      });
      
      // Ensure name field for renderer
      if (processedData.personalInfo.firstName || processedData.personalInfo.lastName) {
        processedData.name = `${processedData.personalInfo.firstName || ''} ${processedData.personalInfo.lastName || ''}`.trim();
      }
      
      setPreviewError(null);
      return processedData;
    } catch (error) {
      console.error('Error processing CV data for preview:', error);
      setPreviewError('Could not process CV data properly. Please continue filling the form.');
      return cvData;
    }
  }, [cvData]);
  
  // Debug form data to see what's being passed to the template
  React.useEffect(() => {
    console.log('LiveCVPreview received data:', cvData);
  }, [cvData]);
  
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };
  
  // Don't render anything on mobile
  if (isMobile) {
    return null;
  }
  
  return (
    <div className="mt-8 border-t pt-6">
      <Button 
        type="button"
        onClick={togglePreview}
        variant="outline"
        className="w-full flex items-center justify-center py-3 gap-2"
      >
        <Eye className="h-4 w-4" />
        {isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
        {isPreviewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isPreviewOpen && (
        <div className="mt-6 border rounded-md p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Live Preview</h3>
          <p className="text-sm text-gray-500 mb-4">This preview updates in real-time as you fill in your information.</p>
          
          {previewError && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{previewError}</AlertDescription>
            </Alert>
          )}
          
          <div className="bg-white border rounded-md overflow-auto" style={{ height: '600px' }}>
            <ErrorBoundary
              fallback={
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <h3 className="text-lg font-medium text-red-800 mb-2">Template Preview Error</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    There was an error displaying the template preview. Please continue filling your information.
                  </p>
                  <p className="text-xs text-gray-500">
                    The final CV will still be generated correctly once all information is complete.
                  </p>
                </div>
              }
            >
              <DirectTemplateRenderer 
                templateId={templateId} 
                cvData={validatedData} 
                height="auto"
              />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCVPreview;