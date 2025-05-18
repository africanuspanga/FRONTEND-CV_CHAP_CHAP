import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current device is mobile based on screen width
 * Also provides additional viewport information for responsive design
 * @param breakpoint The width threshold to consider as mobile (default: 768px)
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportInfo, setViewportInfo] = useState({
    width: 0,
    height: 0,
    orientation: 'portrait' as 'portrait' | 'landscape'
  });

  useEffect(() => {
    // Initial check
    const checkIfMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < breakpoint);
      setViewportInfo({
        width,
        height,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };
    
    // Run on mount
    checkIfMobile();
    
    // Set up resize event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [breakpoint]);

  return { isMobile, viewportInfo };
}

export default useIsMobile;