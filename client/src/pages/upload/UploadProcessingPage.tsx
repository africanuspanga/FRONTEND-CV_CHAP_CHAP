import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useLocation } from 'wouter';

const UploadProcessingPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [processingStatus, setProcessingStatus] = useState<'parsing' | 'completed' | 'failed'>('parsing');

  useEffect(() => {
    // Check if we have upload data in session storage
    const uploadData = sessionStorage.getItem('uploadedCVData');
    const insights = sessionStorage.getItem('uploadInsights');
    
    if (uploadData && insights) {
      // If we already have the data, proceed to onboarding
      setTimeout(() => {
        setLocation('/upload/nice-to-meet-you');
      }, 2000);
      return;
    }

    // Start polling for actual parsed data
    const jobId = sessionStorage.getItem('uploadJobId');
    if (!jobId) {
      console.error('No job ID found for upload processing');
      setLocation('/upload');
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        // Check parsing status
        const statusResponse = await fetch(`/api/parsing-status/${jobId}`);
        const statusData = await statusResponse.json();

        if (statusData.success && statusData.status === 'completed') {
          // Get the parsed CV data
          const dataResponse = await fetch(`/api/get-parsed-cv-data/${jobId}`);
          const cvData = await dataResponse.json();

          if (cvData.success && cvData.cv_data) {
            // Store the real parsed data
            sessionStorage.setItem('uploadedCVData', JSON.stringify(cvData.cv_data));
            sessionStorage.setItem('uploadInsights', JSON.stringify(cvData.onboarding_insights));
            
            setProcessingStatus('completed');
            clearInterval(pollInterval);
            setTimeout(() => {
              setLocation('/upload/nice-to-meet-you');
            }, 1000);
          }
        } else if (statusData.status === 'failed') {
          console.error('CV parsing failed:', statusData.error);
          setProcessingStatus('failed');
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error polling parsing status:', error);
      }
    }, 2000); // Poll every 2 seconds

    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      console.error('Processing timeout - falling back to upload page');
      setLocation('/upload');
    }, 30000); // 30 second timeout

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Trophy Icon with Animation */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8 animate-pulse">
          <Trophy className="w-12 h-12 text-green-600" />
        </div>
        
        {/* Main Message */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Finding some good stuff
        </h1>
        
        {/* Loading Animation */}
        <div className="flex justify-center space-x-1 mb-8">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Subtitle */}
        <p className="text-gray-600 max-w-md mx-auto">
          We're analyzing your CV and extracting key information to personalize your experience.
        </p>
        
        {processingStatus === 'completed' && (
          <p className="text-green-600 font-medium mt-4">Analysis complete! Redirecting...</p>
        )}
        
        {processingStatus === 'failed' && (
          <div className="mt-4">
            <p className="text-red-600 font-medium">Processing failed. Please try again.</p>
            <button 
              onClick={() => setLocation('/upload')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProcessingPage;