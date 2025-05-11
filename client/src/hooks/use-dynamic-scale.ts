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
      
      // For final preview page, we need a much more aggressive scaling to ensure the CV fits completely
      // Fixed scale approach for predictable results
      if (isMobile) {
        // On mobile, use a fixed scale that guarantees visibility
        newScale = Math.min(0.3, Math.min(scaleX, scaleY));
      } else {
        // For desktop, ensure the CV fits by using 70% scaling (30% safety margin)
        // This ensures we can see the whole document without scrolling
        newScale = Math.min(0.65, Math.min(scaleX, scaleY));
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