/**
 * Generating Recommendations Component
 * Shows loading indicator while work experience recommendations are being generated
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

const GeneratingRecommendations: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-teal-200 text-teal-800 py-3 px-5 rounded-md flex items-center w-full max-w-md">
        <Loader2 className="h-5 w-5 animate-spin mr-3" />
        <span>Generating Recommendations...</span>
      </div>
    </div>
  );
};

export default GeneratingRecommendations;
