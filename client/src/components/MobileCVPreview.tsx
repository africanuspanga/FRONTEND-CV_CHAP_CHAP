import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from 'lucide-react';
import DirectTemplateRenderer from './DirectTemplateRenderer';
import { CVData } from '../types/cv-types';

interface MobileCVPreviewProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  containerClassName?: string;
}

/**
 * A mobile-optimized CV preview component with zoom controls
 * Uses DirectTemplateRenderer for efficient template rendering
 */
const MobileCVPreview: React.FC<MobileCVPreviewProps> = ({ 
  children, 
  onRefresh,
  containerClassName = ""
}) => {
  const [scale, setScale] = useState(0.8); // Start at 80% zoom for mobile
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5)); // Max zoom 150%
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.4)); // Min zoom 40%
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
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
        {onRefresh && (
          <button 
            onClick={handleRefresh}
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            aria-label="Refresh preview"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-4 h-4"
            >
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
          </button>
        )}
      </div>
      
      {/* Template container with scale transform */}
      <div 
        className={`w-full overflow-auto bg-white shadow-lg ${containerClassName}`}
        style={{ 
          height: '70vh', 
          maxHeight: '500px',
          transformOrigin: 'top center'
        }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          {children}
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