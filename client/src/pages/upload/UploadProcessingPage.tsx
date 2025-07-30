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

    // Simulate processing for demo purposes
    // In real implementation, this would poll the parsing status
    const timer = setTimeout(() => {
      // Mock successful processing
      const mockCVData = {
        personalInfo: {
          firstName: 'AFRICANUS',
          lastName: 'PANGA',
          email: 'africanuspanga@gmail.com',
          phone: '+255753003526',
          city: 'Dar es salaam',
          country: 'Tanzania',
          professionalTitle: 'Digital Marketing Executive'
        },
        workExperiences: [{
          jobTitle: 'Digital Marketing Executive',
          company: 'LEON Bet',
          location: 'Tanzania',
          startDate: 'Jan 2024',
          endDate: 'Current',
          current: true,
          achievements: []
        }]
      };

      const mockInsights = {
        currentJobTitle: 'Digital Marketing Executive',
        currentCompany: 'LEON Bet',
        keySkills: ['SEO strategy', 'copywriting', 'data analytics'],
        tailoredIndustrySuggestion: 'creative copywriting and digital marketing',
        qualityFeedback: {
          goodPoints: [
            'Clear job titles and company names',
            'Professional email format',
            'Complete contact information'
          ],
          improvementPoints: [
            'Add specific achievements and metrics',
            'Include more detailed job descriptions',
            'Add relevant certifications or training'
          ]
        }
      };

      // Store in session storage
      sessionStorage.setItem('uploadedCVData', JSON.stringify(mockCVData));
      sessionStorage.setItem('uploadInsights', JSON.stringify(mockInsights));
      
      setProcessingStatus('completed');
      setTimeout(() => {
        setLocation('/upload/nice-to-meet-you');
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
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
      </div>
    </div>
  );
};

export default UploadProcessingPage;