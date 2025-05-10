import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { FileText, FileTextIcon, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

const CVSteps: React.FC = () => {
  const [, navigate] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
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

  const handleNextClick = () => {
    navigate('/templates');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:items-start justify-between">
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="text-primary">Just three</span> <br />
          <span className="text-blue-600">easy</span> <span className="text-primary">steps</span>
        </h1>
        
        <div className="mt-12 space-y-8">
          <div className="flex items-start">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold mr-4">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Select</h3>
              <p className="text-gray-700">a template from our library of professional designs</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold mr-4">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Build</h3>
              <p className="text-gray-700">your CV with our industry-specific bullet points</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold mr-4">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Customize</h3>
              <p className="text-gray-700">the details and wrap it up. You're ready to send!</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleNextClick}
          className="w-full md:w-auto mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full text-lg"
        >
          Next
        </Button>
        
        <p className="text-sm text-gray-600 mt-6">
          By clicking "Next" or "Just three easy steps", you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Use
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      
      {!isMobile && (
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="w-80 h-96 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 relative">
              <div className="h-4 w-32 bg-blue-600 mb-4 rounded"></div>
              <div className="h-3 w-full bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 w-4/5 bg-gray-200 mb-4 rounded"></div>
              
              <div className="h-4 w-24 bg-blue-600 mt-6 mb-3 rounded"></div>
              <div className="h-3 w-full bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 w-3/4 bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 mb-4 rounded"></div>
              
              <div className="h-4 w-28 bg-blue-600 mt-6 mb-3 rounded"></div>
              <div className="h-3 w-full bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 w-4/5 bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 w-11/12 bg-gray-200 mb-4 rounded"></div>
              
              <div className="h-4 w-20 bg-blue-600 mt-6 mb-3 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 w-3/5 bg-gray-200 mb-2 rounded"></div>
            </div>
            
            {/* Controls overlay */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-full py-2 px-4 flex items-center space-x-3 shadow-md">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <ChevronRight size={18} />
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <FileText size={14} />
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="text-xs">🔗</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="text-xs">👍</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="text-xs">🖼️</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVSteps;