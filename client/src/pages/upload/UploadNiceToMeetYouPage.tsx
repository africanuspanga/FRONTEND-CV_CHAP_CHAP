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
            Nice to meet you, {firstName}! 👋
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
            {/* Current Role */}
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Current Role</h3>
                <p className="text-gray-700">
                  <span className="font-medium">{insights.currentJobTitle}</span>
                  {insights.currentCompany && (
                    <>
                      {' at '}
                      <span className="font-medium">{insights.currentCompany}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Key Skills */}
            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Top Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {insights.keySkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Industry Insight */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Perfect Fit</h3>
              <p className="text-gray-700">
                Your experience shows you're well-suited for opportunities in{' '}
                <span className="font-semibold text-purple-700">
                  {insights.tailoredIndustrySuggestion}
                </span>.
                We'll help you create a CV that highlights your strengths for these roles.
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