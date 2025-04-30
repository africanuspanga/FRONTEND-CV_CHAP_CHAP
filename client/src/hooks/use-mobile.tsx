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
      setIsMobile(window.innerWidth < 768); // Standard breakpoint for mobile
    };

    // Initial check
    checkMobile();

    // Listen for window resize events
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}