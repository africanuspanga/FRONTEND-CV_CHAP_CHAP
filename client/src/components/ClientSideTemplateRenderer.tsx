import React, { useEffect, useRef, useState } from 'react';
import { CVData } from '@shared/schema';
import { Loader2 } from 'lucide-react';
import { getTemplateByID } from '@/templates';

interface ClientSideTemplateRendererProps {
  templateId: string;
  cvData: CVData;
  className?: string;
  height?: number;
}

/**
 * Component for rendering CV templates with real-time data updates
 */
export const ClientSideTemplateRenderer = ({ 
  templateId, 
  cvData,
  className = '',
  height = 600
}: ClientSideTemplateRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setError('No template selected');
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Short delay to allow for state updates to complete
    const timer = setTimeout(() => {
      try {
        // Get the template component function
        const template = getTemplateByID(templateId);
        
        if (!template) {
          setError(`Template "${templateId}" not found`);
          setLoading(false);
          return;
        }

        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error loading template:', err);
        setError('Failed to load template');
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [templateId]);

  // This is a React component rendering approach rather than iframe
  if (loading) {
    return (
      <div 
        className={`w-full flex items-center justify-center bg-gray-50 ${className}`} 
        style={{ height: `${height}px` }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`w-full flex items-center justify-center bg-gray-50 ${className}`}
        style={{ height: `${height}px` }}
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Get the template component
  const Template = getTemplateByID(templateId)?.render;
  
  if (!Template) {
    return (
      <div 
        className={`w-full flex items-center justify-center bg-gray-50 ${className}`}
        style={{ height: `${height}px` }}
      >
        <div className="text-red-500">Template not found</div>
      </div>
    );
  }

  // Check if we need responsive scaling for mobile
  const [scale, setScale] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // Calculate optimal scale factor on mount and window resize
  useEffect(() => {
    setIsMounted(true);
    
    const calculateOptimalScale = () => {
      if (containerRef.current) {
        // Get container width (accounting for padding)
        const containerWidth = containerRef.current.clientWidth - 20; // Subtract padding
        
        // Our templates are designed for A4 (595px width in standard screen density)
        const templateWidth = 595;
        
        // Calculate scale factor (with a minimum to ensure readability)
        const newScale = Math.max(0.6, Math.min(1, containerWidth / templateWidth));
        setScale(newScale);
      }
    };
    
    // Calculate on mount
    calculateOptimalScale();
    
    // Listen for resize events with throttling
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(calculateOptimalScale, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', calculateOptimalScale);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', calculateOptimalScale);
      clearTimeout(resizeTimer);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`template-preview-container overflow-auto bg-white ${className}`} 
      style={{ height: `${height}px` }}
    >
      <div 
        className="template-scale-container transform-origin-top-left" 
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: 'top center', 
          width: isMounted ? `${100 / scale}%` : '100%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <Template {...cvData} />
      </div>
    </div>
  );
};

export default ClientSideTemplateRenderer;