import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { ClientSideTemplateRenderer } from './ClientSideTemplateRenderer';
import DirectTemplateRenderer from './DirectTemplateRenderer';
import { CVData } from '@shared/schema';
import ErrorBoundary from './ErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MobileCVPreview from './MobileCVPreview';
import useIsMobile from '@/hooks/useIsMobile';

interface LiveCVPreviewProps {
  cvData: CVData;
  templateId: string;
  alwaysVisible?: boolean;
}

const LiveCVPreview: React.FC<LiveCVPreviewProps> = ({ 
  cvData, 
  templateId,
  alwaysVisible = false 
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(alwaysVisible);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isMobile } = useIsMobile();
  
  // Force preview open if alwaysVisible is true
  useEffect(() => {
    if (alwaysVisible && !isPreviewOpen) {
      setIsPreviewOpen(true);
    }
  }, [alwaysVisible, isPreviewOpen]);
  
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
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };
  
  // Preview error panel component to avoid repeating code
  const PreviewErrorPanel = () => (
    previewError ? (
      <Alert className="mb-4 border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
        <AlertDescription className="text-amber-700">{previewError}</AlertDescription>
      </Alert>
    ) : null
  );
  
  // Mobile-optimized preview
  if (isMobile) {
    return (
      <div className="mt-4 mb-6">
        <Button 
          type="button"
          onClick={togglePreview}
          variant="outline"
          className="w-full flex items-center justify-center py-2 gap-2"
        >
          <Eye className="h-4 w-4" />
          {isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
          {isPreviewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {isPreviewOpen && (
          <div className="mt-3">
            <h3 className="text-base font-medium mb-2">Live Preview</h3>
            <p className="text-xs text-gray-500 mb-3">Updates as you fill in your information</p>
            
            <PreviewErrorPanel />
            
            <MobileCVPreview
              key={refreshKey}
              onRefresh={handleRefresh}
              containerClassName="mt-2"
            >
              <ErrorBoundary
                fallback={
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <h3 className="text-base font-medium text-red-800 mb-2">Preview Error</h3>
                    <p className="text-xs text-gray-600">
                      Please continue filling your information.
                    </p>
                  </div>
                }
              >
                <DirectTemplateRenderer 
                  templateId={templateId} 
                  data={validatedData} 
                />
              </ErrorBoundary>
            </MobileCVPreview>
          </div>
        )}
      </div>
    );
  }
  
  // Desktop preview
  return (
    <div className="mt-8 border-t pt-6">
      {!alwaysVisible && (
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
      )}
      
      {isPreviewOpen && (
        <div className="mt-6 border rounded-md p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-1"
              title="Refresh preview"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">This preview updates in real-time as you fill in your information.</p>
          
          <PreviewErrorPanel />
          
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
                key={refreshKey}
                templateId={templateId} 
                data={validatedData}
              />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCVPreview;