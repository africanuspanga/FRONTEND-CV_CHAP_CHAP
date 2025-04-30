import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { ClientSideTemplateRenderer } from './ClientSideTemplateRenderer';
import { CVData } from '@shared/schema';

interface LiveCVPreviewProps {
  cvData: CVData;
  templateId: string;
}

const LiveCVPreview: React.FC<LiveCVPreviewProps> = ({ cvData, templateId }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };
  
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
            <ClientSideTemplateRenderer 
              templateId={templateId} 
              cvData={cvData} 
              height={600}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCVPreview;