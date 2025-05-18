import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  className,
  containerClassName,
  onRefresh
}) => {
  const [scale, setScale] = useState(0.65); // Default scale for mobile view
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Reset scale when device orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      // Reset to appropriate default scale based on orientation
      setScale(window.innerWidth > window.innerHeight ? 0.8 : 0.65);
    };
    
    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.4));
  };
  
  const resetZoom = () => {
    setScale(window.innerWidth > window.innerHeight ? 0.8 : 0.65);
  };
  
  return (
    <div className={cn('w-full', containerClassName)}>
      {/* Zoom controls */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomOut}
            className="p-1 h-8 w-8"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomIn}
            className="p-1 h-8 w-8"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetZoom}
            className="text-xs"
          >
            Reset ({Math.round(scale * 100)}%)
          </Button>
        </div>
        
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="p-1 h-8 w-8"
            aria-label="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Preview container */}
      <div className="cv-preview-container-mobile">
        <div 
          ref={previewRef}
          className={cn(
            'cv-preview-mobile absolute inset-0 overflow-auto bg-white',
            className
          )}
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            height: scale < 1 ? `${100 / scale}%` : '100%',
            width: '100%'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileCVPreview;