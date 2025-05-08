import React from 'react';
import { Info } from 'lucide-react';

/**
 * A simple component that shows a note on mobile views indicating
 * that CV preview is available on the final step
 */
const MobilePreviewNote: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Check if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Don't render on desktop
  if (!isMobile) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 mb-4 bg-primary/10 text-primary text-sm rounded-md">
      <Info className="h-4 w-4 flex-shrink-0" />
      <p>You'll see a complete preview of your CV on the final step.</p>
    </div>
  );
};

export default MobilePreviewNote;