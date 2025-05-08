import { useState, useEffect, RefObject } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// A4 paper dimensions in pixels at 96 DPI
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

/**
 * Hook to calculate dynamic scaling factor for fitting content within a container
 * Uses the "fit and contain" approach to ensure content is fully visible
 */
export function useDynamicScale(
  containerRef: RefObject<HTMLElement>,
  dependencies: any[] = []
): { 
  scale: number; 
  containerWidth: number; 
  containerHeight: number;
} {
  const [dimensions, setDimensions] = useState({
    scale: 1,
    containerWidth: 0,
    containerHeight: 0
  });
  
  const isMobile = useIsMobile();

  useEffect(() => {
    // Function to calculate and set the scale
    const calculateScale = () => {
      if (!containerRef.current) return;

      // Get the available width and height of the container
      const availableWidth = containerRef.current.clientWidth;
      const availableHeight = containerRef.current.clientHeight;

      if (availableWidth <= 0 || availableHeight <= 0) return;

      // Calculate the scale factors for width and height
      const scaleX = availableWidth / A4_WIDTH_PX;
      const scaleY = availableHeight / A4_HEIGHT_PX;

      let newScale;
      
      if (isMobile) {
        // On mobile, prioritize fitting the width to make content readable
        // but still respect height constraints with a minimum scale
        newScale = Math.min(
          // Don't go below 0.4x scale to keep text readable
          Math.max(0.4, scaleX), 
          // Don't make it bigger than what fits vertically
          scaleY
        );
        
        // Add extra safety margin on mobile (10%)
        newScale = newScale * 0.9;
      } else {
        // On desktop, use standard fit algorithm with small margin
        newScale = Math.min(scaleX, scaleY) * 0.95; // 5% margin for safety
      }

      console.log("Scale calculation:", { 
        availableWidth, 
        availableHeight, 
        scaleX, 
        scaleY, 
        newScale 
      });

      setDimensions({
        scale: newScale,
        containerWidth: availableWidth,
        containerHeight: availableHeight
      });
    };

    // Calculate immediately and then on resize
    calculateScale();

    // Set up resize listener
    const handleResize = () => {
      calculateScale();
    };

    window.addEventListener('resize', handleResize);

    // Recalculate after a short delay to make sure container has proper dimensions
    const timeoutId = setTimeout(() => {
      calculateScale();
    }, 300);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isMobile, ...dependencies]);

  return dimensions;
}