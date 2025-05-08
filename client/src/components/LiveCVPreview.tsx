import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { ClientSideTemplateRenderer } from './ClientSideTemplateRenderer';
import DirectTemplateRenderer from './DirectTemplateRenderer';
import { CVData } from '@shared/schema';
import ErrorBoundary from './ErrorBoundary';

interface LiveCVPreviewProps {
  cvData: CVData;
  templateId: string;
}

const LiveCVPreview: React.FC<LiveCVPreviewProps> = ({ cvData, templateId }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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
          
          <div className="bg-white border rounded-md overflow-hidden" style={{ height: '600px' }}>
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
                cvData={cvData} 
                height={600}
              />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCVPreview;