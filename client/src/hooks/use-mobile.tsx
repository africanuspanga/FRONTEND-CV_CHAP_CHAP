import { useState, useEffect } from 'react';

/**
 * Hook to detect mobile viewports
 * @returns boolean indicating if the viewport is mobile sized
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if viewport is mobile-sized
    const checkMobile = () => {
      // Prioritize detecting mobile devices via user agent first for better accuracy
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
      
      // Then check viewport width as fallback - prioritize mobile first approach
      const isMobileViewport = window.innerWidth < 768; // Standard breakpoint for mobile
      
      setIsMobile(isMobileDevice || isMobileViewport);
    };

    // Initial check
    checkMobile();

    // Listen for window resize events with throttling for performance
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);

    // Also listen for orientation changes for mobile devices
    window.addEventListener('orientationchange', checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', checkMobile);
      clearTimeout(resizeTimer);
    };
  }, []);

  return isMobile;
}