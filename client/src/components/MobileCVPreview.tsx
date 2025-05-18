import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface MobileCVPreviewProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  onRefresh?: () => void;
}

/**
 * Optimized CV preview component for mobile devices
 * Provides zoom controls and proper scaling for small screens
 */
const MobileCVPreview: React.FC<MobileCVPreviewProps> = ({
  children,
  className = '',
  containerClassName = '',
  onRefresh
}) => {
  const [scale, setScale] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.3));
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      setIsLoading(true);
      // Simulate loading time for better UX
      setTimeout(() => {
        onRefresh();
        setIsLoading(false);
      }, 300);
    }
  };
  
  return (
    <div className={`${containerClassName}`}>
      {/* Zoom controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="p-1 h-8 w-8"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs">{Math.round(scale * 100)}%</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="p-1 h-8 w-8"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-8 w-8" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {/* CV Preview with scaling */}
      <div className="overflow-auto border rounded-md bg-white">
        <div 
          className={`transform origin-top transition-transform duration-200 ${className}`}
          style={{ 
            transform: `scale(${scale})`,
            width: `${100 / scale}%`,
            height: `${100 / scale}%`
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileCVPreview;