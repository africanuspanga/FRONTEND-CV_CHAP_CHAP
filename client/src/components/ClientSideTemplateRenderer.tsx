import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CVData } from '@shared/schema';
import { Loader2 } from 'lucide-react';
import { getTemplateByID } from '@/lib/simple-template-registry';

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
  // All state hooks must be defined at the top level
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [template, setTemplate] = useState<any>(null);

  // Handle template loading
  useEffect(() => {
    if (!templateId) {
      setError('No template selected');
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // Get the template component function
      const templateObj = getTemplateByID(templateId);
      
      if (!templateObj) {
        setError(`Template "${templateId}" not found`);
        setLoading(false);
        return;
      }

      setTemplate(templateObj.render);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error loading template:', err);
      setError('Failed to load template');
      setLoading(false);
    }
  }, [templateId]);

  // Handle responsive scaling
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

  // Render loading state
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

  // Render error state
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

  // Render template not found state
  if (!template) {
    return (
      <div 
        className={`w-full flex items-center justify-center bg-gray-50 ${className}`}
        style={{ height: `${height}px` }}
      >
        <div className="text-red-500">Template not found</div>
      </div>
    );
  }

  // Render template
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
        {(() => {
          try {
            // Handle JSX elements
            if (template && React.isValidElement(template)) {
              return template;
            }
            // Handle function components
            else if (typeof template === 'function') {
              // Prepare default safe data with fallbacks for each property
              const safeData = {
                personalInfo: cvData?.personalInfo || {},
                workExperience: cvData?.workExperience || [],
                education: cvData?.education || [],
                skills: cvData?.skills || [],
                summary: cvData?.summary || '',
                languages: cvData?.languages || [],
                references: cvData?.references || []
              };
              // Call the template function with safe data
              return template(safeData);
            }
            // Handle invalid template case
            return <div className="text-red-500 p-4">Invalid template format</div>;
          } catch (error) {
            console.error('Template rendering error:', error);
            return (
              <div className="text-red-500 p-4 flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-lg font-medium text-red-800 mb-2">Template Error</h3>
                <p className="text-sm text-gray-600 mb-2">
                  There was an error rendering this template.
                </p>
                <p className="text-xs text-gray-500">
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default ClientSideTemplateRenderer;