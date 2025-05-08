import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop component that automatically scrolls the window to top
 * whenever the route changes.
 */
export default function ScrollToTop() {
  // Get the current location from wouter
  const [location] = useLocation();

  // Effect to scroll to top when location changes
  useEffect(() => {
    // Scroll to top of the page with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Using 'auto' instead of 'smooth' for immediate effect
    });
  }, [location]); // Depend on location changes

  // This component doesn't render anything
  return null;
}