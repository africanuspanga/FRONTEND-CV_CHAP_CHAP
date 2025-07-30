import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ArrowRight, FileText } from 'lucide-react';

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

const UploadGreatStartPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [insights, setInsights] = useState<OnboardingInsights | null>(null);

  useEffect(() => {
    // Load the insights
    const storedInsights = sessionStorage.getItem('uploadInsights');
    
    if (storedInsights) {
      setInsights(JSON.parse(storedInsights));
    } else {
      // Redirect back to upload if no data found
      setLocation('/upload');
    }
  }, [setLocation]);

  const handleStartEditing = () => {
    // Navigate to the personal info form with uploaded data
    setLocation('/cv/brightDiamond/personal');
  };

  if (!insights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You're off to a great start!
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We've analyzed your CV and here's our feedback to help you create an even stronger version.
          </p>
        </div>

        {/* Feedback Cards */}
        <div className="space-y-6 mb-8">
          {/* You got it right */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                You got it right
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.qualityFeedback.goodPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How we'll help you improve */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">💡</span>
                </div>
                How we'll help you improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.qualityFeedback.improvementPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mt-0.5 flex-shrink-0"></div>
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {insights.qualityFeedback.skillsCount}
                  </div>
                  <div className="text-sm text-gray-600">Skills Listed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {insights.qualityFeedback.hasSummary ? '✓' : '×'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Professional Summary
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Ready to create your improved CV?
          </h2>
          <p className="text-gray-600">
            Choose from our professional templates and we'll help you polish your content.
          </p>
          
          <Button
            onClick={handleStartEditing}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Editing Your CV
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Step 2 of 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadGreatStartPage;