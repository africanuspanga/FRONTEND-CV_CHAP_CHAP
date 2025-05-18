import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is a mobile device
 * @param mobileBreakpoint The maximum width in pixels to consider as mobile (default: 768px)
 * @returns boolean indicating if the current viewport is mobile
 */
export function useIsMobile(mobileBreakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    
    // Check immediately
    checkMobile();
    
    // Set up resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  return isMobile;
}

export default useIsMobile;