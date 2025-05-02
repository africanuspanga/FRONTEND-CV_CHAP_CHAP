/**
 * Generating Recommendations Component
 * Shows loading indicator while work experience recommendations are being generated
 * Designed to appear briefly for a smoother UX
 */

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const GeneratingRecommendations: React.FC = () => {
  // Track whether to show fast loading messages
  const [loadingMessage, setLoadingMessage] = useState('Generating recommendations...');
  
  // Fast spinning loader and progress messages
  useEffect(() => {
    const messages = [
      'Analyzing job requirements...',
      'Preparing recommendations...',
      'Almost ready...',
    ];
    
    // Change message every 100ms for fast feedback
    const interval = setInterval(() => {
      setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-teal-200 text-teal-800 py-3 px-5 rounded-md flex items-center w-full max-w-md shadow-md">
        <Loader2 className="h-5 w-5 animate-spin mr-3" />
        <span>{loadingMessage}</span>
      </div>
    </div>
  );
};

export default GeneratingRecommendations;
