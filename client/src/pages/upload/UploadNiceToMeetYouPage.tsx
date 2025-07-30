import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Trophy, Briefcase, MapPin } from 'lucide-react';

interface OnboardingInsights {
  currentJobTitle: string;
  currentCompany: string;
  keySkills: string[];
  tailoredIndustrySuggestion: string;
  qualityFeedback: {
    goodPoints: string[];
    improvementPoints: string[];
    skillsCount: number;
    hasSummary: boolean;
  };
}

const UploadNiceToMeetYouPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [insights, setInsights] = useState<OnboardingInsights | null>(null);
  const [cvData, setCvData] = useState<any>(null);

  useEffect(() => {
    // Load the uploaded CV data and insights
    const storedCVData = sessionStorage.getItem('uploadedCVData');
    const storedInsights = sessionStorage.getItem('uploadInsights');
    
    if (storedCVData && storedInsights) {
      setCvData(JSON.parse(storedCVData));
      setInsights(JSON.parse(storedInsights));
    } else {
      // Redirect back to upload if no data found
      setLocation('/upload');
    }
  }, [setLocation]);

  const handleContinue = () => {
    setLocation('/upload/great-start');
  };

  if (!insights || !cvData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const firstName = cvData.personalInfo?.firstName || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nice to meet you!
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We've analyzed your CV and discovered some great insights about your professional journey.
          </p>
        </div>

        {/* Insights Card */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Here's what we learned about you
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Character Illustration */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="text-4xl">👩‍💼</div>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700">
                You are currently a <strong>{insights.currentJobTitle}</strong> at <strong>{insights.currentCompany}</strong>.
              </p>
              
              <p className="text-lg text-gray-700">
                Your strong skills in{' '}
                <strong>{insights.keySkills.slice(0, 3).join(', ')}</strong>{' '}
                have consistently driven impressive results in your campaigns.
              </p>
              
              <p className="text-lg text-gray-700">
                We will tailor your resume-building experience to emphasize your expertise in{' '}
                <strong>{insights.tailoredIndustrySuggestion}</strong> to attract potential employers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Let's see how we can improve it
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Step 1 of 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNiceToMeetYouPage;