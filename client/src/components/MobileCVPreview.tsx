import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from 'lucide-react';
import DirectTemplateRenderer from './DirectTemplateRenderer';
import { CVData } from '@/types/cv-types';

interface MobileCVPreviewProps {
  data: CVData;
  templateId: string;
}

/**
 * A mobile-optimized CV preview component with zoom controls
 * Uses DirectTemplateRenderer for efficient template rendering
 */
const MobileCVPreview: React.FC<MobileCVPreviewProps> = ({ data, templateId }) => {
  const [scale, setScale] = useState(0.8); // Start at 80% zoom for mobile
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5)); // Max zoom 150%
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.4)); // Min zoom 40%
  };
  
  return (
    <div className="mobile-cv-preview relative w-full overflow-hidden bg-gray-100 rounded-md">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button 
          onClick={zoomOut}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          aria-label="Zoom out"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <button 
          onClick={zoomIn}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          aria-label="Zoom in"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
      
      {/* Template container with scale transform */}
      <div 
        className="w-full overflow-auto bg-white shadow-lg"
        style={{ 
          height: '70vh', 
          maxHeight: '500px',
          transformOrigin: 'top center'
        }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          <DirectTemplateRenderer 
            templateId={templateId} 
            data={data} 
            containerClassName="min-h-[842px] w-[595px] mx-auto"
          />
        </div>
      </div>
      
      {/* Zoom percentage indicator */}
      <div className="absolute bottom-2 right-2 text-xs bg-white px-2 py-1 rounded shadow">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default MobileCVPreview;