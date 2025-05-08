import { useState, useEffect, RefObject } from 'react';

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

      // Use the smaller scale to ensure the entire content fits
      const newScale = Math.min(scaleX, scaleY) * 0.95; // 5% margin for safety

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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [...dependencies]);

  return dimensions;
}