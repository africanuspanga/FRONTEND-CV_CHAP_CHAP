import React, { useEffect } from 'react';
import faviconIco from '@assets/favicon.ico';

/**
 * Component that dynamically adds the favicon to the document head
 * This approach can work when traditional HTML-based favicon links fail
 */
const FaviconUpdater: React.FC = () => {
  useEffect(() => {
    // Remove any existing favicons
    const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    existingFavicons.forEach(node => node.parentNode?.removeChild(node));
    
    // Create and add new favicon link
    const link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.href = faviconIco;
    document.head.appendChild(link);
    
    // Create and add standard favicon
    const standardLink = document.createElement('link');
    standardLink.rel = 'icon';
    standardLink.href = faviconIco;
    document.head.appendChild(standardLink);
    
    return () => {
      // Cleanup when component unmounts
      document.head.removeChild(link);
      document.head.removeChild(standardLink);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FaviconUpdater;